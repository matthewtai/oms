// import React, { Component } from "react";
// // import DeleteBtn from "../../components/DeleteBtn";
// import Jumbotron from "../../components/Jumbotron";


// class Main extends Component {
//   state = {
//     books: [],
//     title: "",
//     author: "",
//     synopsis: ""
//   };

//   componentDidMount() {
//     this.loadUsers();
//     this.alphaApi();
//   }

//   loadUsers = () => {
//     API.getUsers()
//       .then(res =>
//         console.log(res)
//       )
//       .catch(err => console.log(err));
//   };
//   loadPortfolios = () => {
//     API.getPortfolios()
//       .then(res =>
//         console.log(res)
//       )
//       .catch(err => console.log(err));
//   };
//   alphaApi = () => {
//     API.getIntraday()
//     .then(res =>{
//       console.log("hello")
//       console.log(res)
//     }
//     )
//     .catch(err => console.log(err));
//   }

//   render() {
//     return (
      
//     );
//   }
// }

// export default Main;

import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import SearchBar from '../../components/SearchBar/SearchBar';
import StockList from '../../components/StockList/StockList';
import './main.css';
import API from "../../utils/API";

class Main extends Component {
  
  state = {
    stocks: [],
    term: null,
    value: '',
    newWeight: 0,
    price: 0,
  };
  componentDidMount() {
    this.loadUsers();
    //this.performSearch();
    // this.handleAlphaApi();
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

  // handleNewWright = (value) => {
  //   event.preventDefault();
  //   this.setState({
  //     newWeight: value
  //   })
  // };

  // handleOwnedShares = (query) => {

  // }

  performSearch = (query) => {
    API.getQuote(query)
    .then(res =>{
      console.log(res.data["Global Quote"]["05. price"]);
      let stocks = _.flattenDeep( Array.from([res.data['Global Quote']]).map((stock) => 
      [{
        symbol: stock["01. symbol"], 
        price: stock["05. price"], 
        change: stock["10. change percent"]},
      ]) 
      );
      // let stocks = _.flattenDeep([res.data])
      console.log(stocks);
      this.setState({
        price: parseFloat(res.data["Global Quote"]["05. price"]).toFixed(2)
      })
      console.log(this.state.price)
      this.setState((state, props) => {
        return {
          ...state,
        stocks
        }
      });
    }

    
    ).catch(err => console.log(err));
  }
  
  handleAlphaApi = () => {
    API.getSearch()
    .then(res =>{
      console.log(res);
    }
    )
    .catch(err => console.log(err));
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.performSearch(this.state.value);
  }

  

    //this.handleClick = this.handleClick.bind(this);
    //handleChange = this.handleChange.bind(this);
  

  handleChange= (e) => {
    this.setState({
      value: e.target.value
    });
  }

  render = () => {
    let stocks = this.state.stocks;
    const value = this.state.value;

    return (
      <div className="App">
        <h1 className="App__Title">Stock Search</h1>
        <SearchBar value={ value }
                   onChange={ this.handleChange }
                   onClick={ this.handleSubmit }/>
        <StockList stockItems={ this.state.stocks }/>
      </div>
    );
  }
}
export default Main;
