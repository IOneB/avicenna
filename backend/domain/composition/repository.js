const repositoryConstructor = require("../../infrastructure/persistence");
const Model = require("./model");

const repository = new repositoryConstructor(new Model(), "composition", false);

module.exports = repository;