var db = require("../../models");
// const axios = require("axios");
// const router = require("express").Router();

module.exports = function(app) {

    app.post("/api/login/accounts", function(req,res){
        console.log("hello");
        db.User.findOne({
            where: {
                username: req.body.userName,
                password: req.body.password
            }
        }).then(function(result) {
            // console.log(result);
            res.json(result);
        });
    });

    app.post("/api/signup", (req,res) => {
        db.User.create({
            username: req.body.userName,
            password: req.body.password
        }).then(result => {
            console.log(result)
            res.json(result)
        })
         .catch(function(err) {
             res.json(err)
         });
    });

    
}
