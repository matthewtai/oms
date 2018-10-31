import React, { Component } from "react";
import _ from "lodash";
//import axios from 'axios';
// import SearchBar from "../../components/SearchBar/SearchBar";
import StockList from "../../components/StockList/StockList";
// import StockListItem from "../../components/StockListItem/StockListItem";
import "./main.css";
import API from "../../utils/API";
import "react-table/react-table.css";
import ReactTable from "react-table";
import StagingTable from "../../components/StagingTable/StagingTable";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { initializeIcons } from "@uifabric/icons";
import Axios from "axios";

initializeIcons();

class Main extends Component {
  state = {
    stocks: [],
    term: null,
    value: "",
    price: 0,
    data: [],
    tickerName: "",
    currency: "",
    stagingData : [],
    exchangerate: "",
    ticker: "",
  };

  componentDidMount() {
    this.loadPortfolios();
    //this.performSearch();
    this.handleAlphaApi();
    this.loadStagingData();
  }

  loadUsers = () => {
    API.getUsers()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  loadPortfolios = () => {
    API.getPortfolios()
      .then(res => {
        //console.log(res.data)
        // this.setState({
        //   data: res.data
        // });
        this.setupData(res.data);
      })
      .catch(err => console.log(err));
  };

  setupData = data => {
    data.map(element => {
      element.newWeight = 0;
      // element.changed = false;
    });
    this.setState({
      data: data
    });
  };

  loadStagingData = () => {
    API.getStaging()
      .then(res => {
        console.log(res);
        this.setState({
          stagingData: res.data
        });
      })
  }

  alertSomething = (props) =>{
    //event.preventDefault();
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    // let newShares = portfolios[index].cash*(portfolios[index].newWeight/100);
    // console.log(this.state.price);
    let weight = portfolios[index].newWeight / 100 - portfolios[index].old_weight / 100
    this.handleBuyOrSell(index, weight)
    if(weight < 0){
        let newShares =  (Math.abs(weight) * portfolios[index].NAV) / (this.state.price * this.state.exchangerate);
        return (portfolios[index].shares_buy_sell = Math.round(newShares) * 100);
    }else{
      let newShares =(weight * portfolios[index].NAV) / (this.state.price * this.state.exchangerate);
      return (portfolios[index].shares_buy_sell = Math.round(newShares / 100) * 100);
    }
  };

  handleBuyOrSell = (index, weight) => {
    const portfolios = this.state.data;
    let sellOrBuy = "";
    if(weight < 0){
      sellOrBuy = "sell"
      return(portfolios[index].buy_or_sell = sellOrBuy);
    }else{
      sellOrBuy = "buy"
      return(portfolios[index].buy_or_sell = sellOrBuy);
    }
  }

  //((new weight - old weight) *x* NAV) */* (price per share *x* FX rate)

  // handleSaveStages = () => {
  //   const portfolios = this.state
  //   const index = portfolios.findIndex((element) => {
  //     return element.id === props.row.id;
  //   });
  
  performSearch = query => {
    API.getQuote(query)
      .then(res => {
        //console.log(res.data["Global Quote"]["05. price"]);
        // console.log(res.data["Global Quote"]["05. price"]);
        let stocks = _.flattenDeep(
          Array.from([res.data["Global Quote"]]).map(stock => [
            {
              symbol: stock["01. symbol"],
              price: stock["05. price"],
              change: stock["10. change percent"]
            }
          ])
        );
        // let stocks = _.flattenDeep([res.data])
        //console.log(stocks);
        this.setState({
          ticker: res.data["Global Quote"]["01. symbol"],
          price: parseFloat(res.data["Global Quote"]["05. price"]).toFixed(2)
        });
        //console.log(this.state.price);
        this.setState((state, props) => {
          return {
            ...state,
            stocks
          };
        });
      })
      .catch(err => console.log(err));
  };

 
  handleAlphaApi = query => {
    API.getSearch(query)
      .then(res => {
        // console.log(res);

        const namecurrency = _.flattenDeep(res.data.bestMatches);
        this.setState({
          tickerName: namecurrency[0]["2. name"],
          currency: namecurrency[0]["8. currency"]
        });
        console.log(this.state.currency);
        this.handleAlphaApiCurrency(this.state.currency)
      })
      .catch(err => console.log(err));
  };

  handleAlphaApiCurrency = query => {
    API.getExchange(query)
      .then(res => {
        console.log(res);

        const exchangerate = _.flattenDeep([res.data["Realtime Currency Exchange Rate"]]);
        // console.log(exchangerate[0]["5. Exchange Rate"])
        this.setState({
          exchangerate: exchangerate[0]["5. Exchange Rate"],
          
        });
        console.log(this.state.exchangerate);
      })
      .catch(err => console.log(err));
  };

  handleSubmit = () => {
    this.performSearch(this.state.value);
    this.handleAlphaApi(this.state.value);
  };


  handleNewWeightChange = (props, event) => {
    //console.log(props.target.value)
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    //console.log(event.target.value);
    portfolios[index].newWeight = event.target.value;
    //come back to this
    // portfolios[index].changed = true; 
    this.setState({
      data: portfolios
    });
    this.alertSomething(props);
  };

  //((new weight - old weight) *x* NAV) */* (price per share *x* FX rate)

  handleSaveStages = (props) => {
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    const save = {
      portfolio_manager: portfolios[index].portfolio,
      ticker: this.state.ticker,
      portfolio: portfolios[index].portfolio,
      old_weight: portfolios[index].old_weight,
      new_weight: portfolios[index].newWeight,
      shares_buy_sell: portfolios[index].shares_buy_sell,
      buy_or_sell: portfolios[index].buy_or_sell,
      ticker_name: this.state.tickerName,
    }
    Axios.post("/api/posts/", save, function(result){
       console.log("main.js results: " + result);
    });
    window.location.reload(true); // fix this later 
    console.log(this.state.stagingData);
  }
  
  getnewWeightValue = props => {
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    // console.log(index)
    return portfolios[index].newWeight;
  }

  render = () => {
    //console.log(this.state.data.length);
    // console.log(this.state.data);
    return (
      <Fabric>
        <div className="App">
          <div className="SearchBar">
            <SearchBox
              placeholder="Ticker"
              onChange={value =>
                this.setState({
                  value: value
                })
              }
              onSearch={this.handleSubmit}
            />
          </div>
          {/* <SearchBar value={ value }
                   onChange={ this.handleSearchChange }
                   onClick={ this.handleSubmit }/> */}
          <StockList
            currency={this.state.currency}
            tickerName={this.state.tickerName}
            stockItems={this.state.stocks}
          />
          {this.state.data.length ? (
            <ReactTable
              data={this.state.data}
              columns={[
                {
                  //Header: "Name",
                  columns: [
                    {
                      Header: "ID",
                      id: "id",
                      accessor: "id",
                      maxWidth: 50
                    },
                    {
                      Header: "Portfolio",
                      accessor: "portfolio",
                      maxWidth: 200
                      
                    },
                    {
                      Header: "NAV",
                      accessor: "NAV",
                      maxWidth: 200
                    },
                    {
                      Header: "Current Cash(%)",
                      accessor: "current_cash",
                      maxWidth: 200
                    },
                    {
                      Header: "Old Weight(%)",
                      accessor: "old_weight",
                      maxWidth: 200
                    },
                    {
                      Header: "Shares Owned",
                      accessor: "shares_owned",
                      maxWidth: 200
                    },
                    {
                      Header: "New Weight(%)",
                      Cell: props => (
                        <div> 
                          <input
                            style={{
                              width: '50px',
                            }}
                            className="number"
                            value={this.getnewWeightValue(props)}
                            onChange={e => this.handleNewWeightChange(props, e)}
                          />
                        </div>
                      ),
                      maxWidth: 200,
                    },
                    {
                      Header: "Shares to Buy/Sell",
                      accessor: "shares_buy_sell",
                      maxWidth: 200,
                    },
                    {
                      Header: "Buy OR Sell",
                      accessor: "buy_or_sell",
                      maxWidth: 200,
                    },  
                    {
                      Header: "Save",
                      Cell: props => (
                        <div>
                          <button 
                               onClick={()=>this.handleSaveStages(props)}
                              >
                              Save
                            </button>
                        </div>
                      ),
                      minWidth: 50
                    }
                  ]
                }
              ]}
              //defaultPageSize={10}
              className="-striped -highlight"
              showPagination={false}
              defaultPageSize={this.state.data.length}
            />
          ) : (
            <h2>NoData</h2>
          )}
          <br /><br />
           {this.state.stagingData.length ? (
            <ReactTable
              data={this.state.stagingData}
              columns={[
                {
                  //Header: "Name",
                  columns: [
                    {
                      Header: "ID",
                      id: "id",
                      accessor: "id",
                      minWidth: 125
                    },
                    {
                      Header: "Ticker",
                      accessor: "ticker",
                      minWidth: 125
                    },
                    {
                      Header: "Portfolio",
                      accessor: "portfolio",
                      minWidth: 125
                    },
                    {
                      Header: "Old Weight(%)",
                      accessor: "old_weight",
                      minWidth: 125
                    },
                    {
                      Header: "New Weight(%)",
                      accessor: "new_weight",
                      minWidth: 125
                    },
                    {
                      Header: "Shares to Buy/Sell",
                      accessor: "shares_buy_sell",
                      minWidth: 125
                    },
                    {
                      Header: "Buy Or Sell",
                      accessor: "buy_or_sell",
                      minWidth: 125,
                    },
                    {
                      Header: "Ticker Name",
                      accessor: "ticker_name",
                      minWidth: 125,
                    },  
                  ]
                }
              ]}
              //defaultPageSize={10}
              className="-striped -highlight"
              showPagination={false}
              defaultPageSize={this.state.stagingData.length}
            />
          ) : (
            <h2>NoData</h2>
          )}

          <br /><br /><br />
          {/* {this.state.stagingData.length ? (
          <StagingTable 
          data={this.state.stagingData}
          />
          ):(<h2>Hahahah</h2>)} */}
        </div>
        {/* <StagingTable/> */}   
      </Fabric>
    );
  };
}

export default Main;
