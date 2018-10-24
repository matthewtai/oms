import React, { Component } from 'react';
import _ from 'lodash';
//import axios from 'axios';
import SearchBar from '../../components/SearchBar/SearchBar';
import StockList from '../../components/StockList/StockList';
import './main.css';
import API from "../../utils/API";
import 'react-table/react-table.css'
import ReactTable from "react-table";

class Main extends Component {
  
  state = {
    stocks: [],
    term: null,
    value: '',
    data: []
  };
  componentDidMount() {
    this.loadPortfolios();
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
      .then(res =>{
        console.log(res.data)
        this.setState({
          data: res.data
        });
      })
      .catch(err => console.log(err));
  };

  performSearch = (query) => {
    API.getQuote(query)
    .then(res =>{
      console.log(res.data);
      let stocks = _.flattenDeep( Array.from([res.data['Global Quote']]).map((stock) => 
      [{
        symbol: stock["01. symbol"], 
        price: stock["05. price"], 
        change: stock['10. change percent']},
      ]) 
      );
      // let stocks = _.flattenDeep([res.data])
      console.log(stocks);
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

  // handleClick = (e) => {
  //   if(e) e.preventDefault();
  //   this.setState({
  //     value: '',
  //     term: this.state.value
  //   });

  //   let term = this.state.value;
  //   const key = 'F41ON15LGCFM4PR7';
  //   const url = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${term}&apikey=${key}`;

  //   axios.get(url)
  //   .then(res => {
  //     console.log(res.data);
  //     let stocks = _.flattenDeep( Array.from(res.data['Stock Quotes']).map((stock) => [{symbol: stock['1. symbol'], price: stock['2. price'], volume: stock['3. volume'], timestamp: stock['4. timestamp']}]) );
  //     console.log(stocks);
  //     this.setState((state, props) => {
  //       return {
  //         ...state,
  //       stocks
  //       }
  //     })
  //   })
  //   .catch(error => console.log(error))
  // }

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
        <ReactTable
          data={this.state.data}
          columns={[
            {
              //Header: "Name",
              columns: [
                {
                  Header: "Portfolio",
                  accessor: "portfolio"
                },
                {
                  Header: "NAV",
                  accessor: "NAV"
                },
                {
                  Header: "Cash",
                  accessor: "cash"
                },
                {
                  Header: "Mandate",
                  accessor: "mandate"
                }
              ]
            }
          ]}
          //defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
export default Main;
