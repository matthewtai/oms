var db = require(".../models");

module.exports = function(app) {
    app.get("/api/stages", function(req,res){
        db.Stages.findAll({}).then(function(result){
            res.json(result);
        })
    });

    app.post("/api/posts", function(req, res){
        db.Stages.create(req.body
          // {
          //   portfolio_manager: req.body.portfolio_manager,
          //   ticker: req.body.ticker,
          //   portfolio: req.body.portfolio,
          //   old_weight: req.body.old_weight,
          //   new_weight: req.body.new_weight,
          //   shares_buy_sell: req.body.shares_buy_sell,
          //   buy_or_sell: req.body.buy_or_sell,
          //   ticker_name: req.body.ticker_name
          // }
            ).then(function(result) {
            console.log(
              "this is the results: " + JSON.stringify(result.id, null, 2)
            );
            res.json(result);
          })
          .catch(function(err) {
            res.json(err);
          });
    }); 

    app.delete("/api/posts/", function(req, res) {
        db.Stages.destroy({
          where: {
            id: req.body.id
          }
        })
          .then(function(result) {
            res.json(result);
          });
      });    
    
}