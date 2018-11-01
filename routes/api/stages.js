var db = require("../../models");

module.exports = function(app) {
    app.get("/api/Staging", function(req,res){
        db.Stages.findAll({}).then(function(result){
            res.json(result);
        })
    });

    app.post("/api/Staging/post", function(req, res){
      // console.log(req.body.portfolio);
      // console.log("hahaha");
        db.Stages.create(req.body

        ).then(function(result) {
            // console.log(
            //   "this is the results: " + JSON.stringify(result.id, null, 2)
            // );
            // result.save().then((result) => {
            //   console.log("saved")
            // })
            // .catch((err) => {
            //   res.json(err);
            // })
            res.json(result);
          })
          .catch(function(err) {
            res.json(err);
          });
    }); 

    app.delete("/api/Staging/delete/:id", function(req, res) {
        db.Stages.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(function(result) {
            res.json(result);
          });
      });     
}

// db.Stages.create(req.body
//   // {
//   //   portfolio_manager: req.body.portfolio_manager,
//   //   ticker: req.body.ticker,
//   //   portfolio: req.body.portfolio,
//   //   old_weight: req.body.old_weight,
//   //   new_weight: req.body.new_weight,
//   //   shares_buy_sell: req.body.shares_buy_sell,
//   //   buy_or_sell: req.body.buy_or_sell,
//   //   ticker_name: req.body.ticker_name
//   // }
//     )