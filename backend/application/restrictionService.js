const restrictionRepository = require("../domain/restriction/repository");

module.exports = {
  async get() {
    const restrictions = await restrictionRepository.get();

    return {
      allergies: restrictions.filter((x) => x.type == 0),
      diseases: restrictions.filter((x) => x.type == 1),
      specialInstructions: restrictions.filter((x) => x.type == 2),
    };
  },
};
