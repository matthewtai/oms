const axios = require("axios");
const router = require("express").Router();
const keys = require("./keys/keys");

// router.get("/api/intraday", (req, res) => {
//   axios({
//     method: "get",
//     url: "https://www.alphavantage.co/query", 
//     params :{ 
//       function: "TIME_SERIES_INTRADAY",
//       symbol: "MSFT",
//       apikey: keys.alpha.api,
//       interval: "5min"
//     }
//   }
//     )
//     .then( Response => {
//       console.log(Response.data);
//       res.json(Response.data);
//     })
//     .catch(err => res.status(422).json(err));
// });
// router.get("/api/intraday", (req, res) => {
//   axios
//     .get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min", { params :{ apikey:keys.alpha.api }})
//     .then( Response => {
//       console.log(Response.data);
//       res.json(Response.data);
//     })
//     .catch(err => res.status(422).json(err));
// });

router.get("/quote", (req, res) => {
  // console.log(req.query.symbol);
  axios
    .get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.query.symbol}&apikey=${keys.alpha.api}`)
    .then( Response => {
            // console.log(Response.data);
            res.json(Response.data);
          })
          .catch(err => res.status(422).json(err));
});

router.get("/search", (req, res) => {

  axios
    .get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${req.query.symbol}&apikey=query`, { params :{ apikey:keys.alpha.api }})
    .then( Response => {
      // console.log(Response.data);
      res.json(Response.data);
    })
    .catch(err => res.status(422).json(err));
});

router.get("/exchange", (req, res) => {
  console.log(req.query.currency)
axios
    .get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${req.query.currency}&to_currency=CAD&apikey=QIRN439QR9P9A8QD`, { params :{ apikey:keys.alpha.api }})
    .then( Response => {
      
      console.log(Response.data);
      res.json(Response.data);
    })
    .catch(err => res.status(422).json(err));
});

module.exports = router;

