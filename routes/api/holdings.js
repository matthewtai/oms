var db = require("../../models");

module.exports = function(app) {
  // Get all examples
  
  app.get("/api/Holdings/:tickerName", function(req, res) {
    //console.log("getting holdings");
    db.Holdings.findAll({where : {ticker: req.params.tickerName}}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });
  app.get("/api/Holdings/:portfolio", function(req, res) {
    //console.log("getting holdings");
    db.Holdings.findAll({where : {ticker: req.params.portfolio}}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });
};