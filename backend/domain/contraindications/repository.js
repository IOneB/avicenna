const repositoryConstructor = require("../../infrastructure/persistence");
const { pool } = require("../../config/database");

const Model = require("./model");

const repository = new repositoryConstructor(
  new Model(),
  "contraindications",
  false
);

repository.getByComponent = async function (id_component) {
  let sql = `
    SELECT c.*, r.type
    FROM contraindications c 
    JOIN restriction r ON r.id = c.id_contraindications
    ${id_component ? "WHERE id_component = " + id_component : null}`;

  const contraindications = await pool.query(sql);

  return contraindications.rows;
};

module.exports = repository;
