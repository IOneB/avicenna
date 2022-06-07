const { pool } = require("../config/database");
const drugService = require("../application/drugService");

module.exports = {
  async compare(patientId, drugId) {
    if (!patientId || !drugId)
      throw new Error("Все поля обязательны для заполнения");

    const patientContraindications = (
      await pool.query(
        `
select 
	r.type,
	r.id as contraindication_id
from patient p 
join contraindications_patient cp on cp.id_patient  = p.id 
left join restriction r on r.id = cp.id_contraindications 
where p.id = $1 and (close_date is null or current_date - close_date < 14)`,
        [patientId]
      )
    ).rows;

    const drugContraindications = (
      await pool.query(
        `select 
	drug.trade_name, c.name, r.type,
	r.id as contraindication_id,
	r.name as contraindication_name
from drug
join composition on composition.id_drug = drug.id 
join component c on c.id = composition.id_component 
join contraindications cp on cp.id_component  = c.id 
left join restriction r on r.id = cp.id_contraindications 
where drug.id = $1`,
        [drugId]
      )
    ).rows;

    const allergies = [];
    const diseases = [];
    const specialInstructions = [];

    for (let i = 0; i < patientContraindications.length; i++) {
      const patientContraindication = patientContraindications[i];
      const drugContraindication = drugContraindications.find(
        (d) =>
          d.type === patientContraindication.type &&
          d.contraindication_id === patientContraindication.contraindication_id
      );

      if (drugContraindication) {
        if (drugContraindication.type === 0) {
          allergies.push(drugContraindication);
        } else if (drugContraindication.type === 1) {
          diseases.push(drugContraindication);
        } else {
          specialInstructions.push(drugContraindication);
        }
      }
    }

    return { allergies, diseases, specialInstructions };
  },
  async analog(drugId) {
    const drug = await drugService.getById(drugId);

    const sql = `SELECT
    d.id, d.trade_name
FROM
    drug d
INNER JOIN composition on composition.id_drug = d.id 
INNER JOIN component c on c.id = composition.id_component 
where composition.is_active = true and d.id_dosage_form = $1 and d.id != $2
GROUP BY
    d.id
having ARRAY_AGG (c.id order by c.id) = ($3)`;

    return (
      await pool.query(sql, [
        drug.id_dosage_form,
        drug.id,
        drug.drugComponents
          .filter((c) => c.is_active)
          .map((c) => c.id)
          .sort(),
      ])
    ).rows;
  },
};
