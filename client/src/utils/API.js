import axios from "axios";

export default {
  // Gets all books
  getUsers: function() {
    return axios.get("/api/Users");
  },
  // Gets the book with the given id
  getPortfolios: function(id) {
    return axios.get("/api/Portfolios");
  },
  //Get live stock data
  getIntraday: function(id) {
    return axios.get("/api/intraday");
  },
  // Deletes the book with the given id
  deleteBook: function(id) {
    return axios.delete("/api/books/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    return axios.post("/api/books", bookData);
  }
};
