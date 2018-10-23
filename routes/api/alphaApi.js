const axios = require("axios");
const router = require("express").Router();
const keys = require("./keys/keys");

router.get("/api/intraday", (req, res) => {
  axios
    .get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=" + { api:keys.alpha.api })
    .then( Response => {
      res.json(Response.data);
    })
    .catch(err => res.status(422).json(err));
});

module.exports = router;

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo