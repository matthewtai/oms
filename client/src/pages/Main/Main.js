import React, { Component } from "react";
// import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
// import { Link } from "react-router-dom";
// import { Col, Row, Container } from "../../components/Grid";
// import { List, ListItem } from "../../components/List";
// import { Input, TextArea, FormBtn } from "../../components/Form";

class Main extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: ""
  };

  componentDidMount() {
    this.loadUsers();
    this.onQuoteSearch("AMZN");
  }

  loadUsers = () => {
    API.getUsers()
      .then(res =>
        console.log(res)
      )
      .catch(err => console.log(err));
  };
  loadPortfolios = () => {
    API.getPortfolios()
      .then(res =>
        console.log(res)
      )
      .catch(err => console.log(err));
  };
  onQuoteSearch = (query) => {
    API.getQuote(query)
    .then(res =>{
      console.log(res)
    }
    )
    .catch(err => console.log(err));
  }

  render() {
    return (
      <Jumbotron><h1>Portfolio folder is console logged</h1></Jumbotron>
    );
  }
}

export default Main;
