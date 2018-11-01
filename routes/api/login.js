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
            console.log(result);
            res.json(result);
        });
    });
}
