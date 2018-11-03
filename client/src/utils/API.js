import axios from "axios";

export default {
  // Gets all users
  getUsers: function() {
    return axios.get("/api/Users");
  },
  // Gets portfolios
  getPortfolios: function() {
    return axios.get("/api/Portfolios");
  },
  //Get live stock data
  getQuote: function(query) {
    return axios.get("/api/quote", { params: { symbol: query } });
  },
  getSearch: function(query) {
    return axios.get("/api/search", { params: { symbol: query } });
  },

  getExchange: function(query) {
    return axios.get("/api/exchange", { params: { currency: query } }); 
  },
  getStaging: function(){
    return axios.get("/api/Staging");
  },
  // Deletes the book with the given id
  deleteStagingRow: function(id) {
    return axios.delete("/api/Staging/delete/" + id);
  },
  postStagingData: function(stagingData){
    return axios.post("/api/Staging/post", stagingData);
  },
  postingLoginData: function(postingData){
    return axios.post("/api/login/accounts", postingData);
  },
  getHoldings: function(tickerName){
    return axios.get("/api/Holdings/"+tickerName);
  },
  getHoldingsByPortfolio: function(portfolioName){
    return axios.get("/api/Holdings/"+portfolioName);
  }
  
  // // Saves a book to the database
  // saveBook: function(bookData) {
  //   return axios.post("/api/books", bookData);
  // },
  // getResults: function(query) {
  //   return axios.get("/api/search", { params: { endpoint: query } });
  // }
};
