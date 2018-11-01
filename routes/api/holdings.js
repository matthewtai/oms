var db = require("../../models");

module.exports = function(app) {
  // Get all examples
  
  app.get("/api/Holdings", function(req, res) {
    db.Portfolios.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });
};