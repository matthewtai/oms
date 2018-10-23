const axios = require("axios");
const router = require("express").Router();
const keys = require("./keys/keys");

router.get("/api/intraday", (req, res) => {
  axios
    .get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo")
    .then( Response => {
      console.log(Response.data);
    })
    .catch(err => res.status(422).json(err));
});

module.exports = router;
// { api: keys.alpha.api }

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo