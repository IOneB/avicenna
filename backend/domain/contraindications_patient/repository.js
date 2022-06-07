const repositoryConstructor = require("../../infrastructure/persistence");
const { pool } = require("../../config/database");

const Model = require("./model");

const repository = new repositoryConstructor(
  new Model(),
  "contraindications_patient",
  false
);

repository.getByPatient = async function (id_patient) {
  let sql = `
    SELECT c.*, r.type
    FROM contraindications_patient c 
    JOIN restriction r ON r.id = c.id_contraindications
    ${id_patient ? "WHERE id_patient = " + id_patient : null}`;

  const contraindications = await pool.query(sql);

  return contraindications.rows;
};

module.exports = repository;
