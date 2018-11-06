var db = require("../../models");

module.exports = function(app) {
  // Get all examples
  
  app.get("/api/aggregate/Holdings/", function(req, res) {
    //console.log("getting holdings");
    db.Holdings.aggregate('shares', 'SUM', { plain: false, group: [ 'ticker' ], attributes: [ 'ticker' ] 
    // db.Holdings.findAll({
    // attributes : [[sequelize.fn('DISTINCT', sequelize.col('shares')), 'ticker']]
    }).then(function(result) {
      // console.log(result);
      res.json(result);
    });
  });

  app.get("/api/Holdings/:tickerName", function(req, res) {
    //console.log("getting holdings");
    db.Holdings.findAll({where : {ticker: req.params.tickerName}}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  app.get("/api/Holdings/portfolio/:portfolio", function(req, res) {
    db.Holdings.findAll({
      where: {
        portfolio: [req.params.portfolio]
      }
    }).then(function(result) {
      // console.log(result);
      res.json(result);
    });
  });

  app.get("/api/all/Holdings", function(req, res) {
    db.Holdings.findAll({}).then(function(dbJobs) {
      // console.log(dbJobs);
      res.json(dbJobs);
    });
  });
};
