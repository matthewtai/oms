const axios = require("axios");
const router = require("express").Router();
const keys = require("./keys/keys");

router.get("/search", (req, res) => {
  
  axios
    .get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=query", { params:keys.alpha.api })
    .then( Response => {
      console.log(Response.data.bestMatches[0]['2. name']);
    })
    .catch(err => res.status(422).json(err));
});

module.exports = router;