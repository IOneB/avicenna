const restrictionService = require("../application/restrictionService");

module.exports = function (app) {
  app.get("/api/restriction", async (req, res) => {
    res.send(await restrictionService.get());
  });
};
