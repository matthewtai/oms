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
  // Deletes the book with the given id
  deleteBook: function(id) {
    return axios.delete("/api/books/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    return axios.post("/api/books", bookData);
  }
};
