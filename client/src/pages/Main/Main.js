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
import SaveBtn from "../../components/saveBtn/saveBtn";
import DeleteBtn from "../../components/DeleteBtn";
import loginBtn from "../../components/LoginBtn"
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
    stagingData: [],
    exchangerate: "",
    ticker: ""
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
      element.newWeight = "";
      element.changed = false;
    });
    this.setState({
      data: data
    });
  };

  loadStagingData = () => {
    API.getStaging().then(res => {
      console.log(res);
      this.setState({
        stagingData: res.data
      });
    });
  };

  deleteStaging = props => {
    console.log(props.original.id);
    API.deleteStagingRow(props.original.id).then(res => {
      this.loadStagingData();
    });
  };
  alertSomething = props => {
    //event.preventDefault();
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    // let newShares = portfolios[index].cash*(portfolios[index].newWeight/100);
    // console.log(this.state.price);
    let weight =
      portfolios[index].newWeight / 100 - portfolios[index].old_weight / 100;
    this.handleBuyOrSell(index, weight);
    if (weight < 0) {
      let newShares =
        (Math.abs(weight) * portfolios[index].NAV) /
        (this.state.price * this.state.exchangerate);
      return (portfolios[index].shares_buy_sell =
        Math.round(newShares / 100) * 100);
    } else {
      let newShares =
        (weight * portfolios[index].NAV) /
        (this.state.price * this.state.exchangerate);
      return (portfolios[index].shares_buy_sell =
        Math.round(newShares / 100) * 100);
    }
  };

  handleBuyOrSell = (index, weight) => {
    const portfolios = this.state.data;
    let sellOrBuy = "";
    if (weight < 0) {
      sellOrBuy = "Sell";
      return (portfolios[index].buy_or_sell = sellOrBuy);
    } else {
      sellOrBuy = "Buy";
      return (portfolios[index].buy_or_sell = sellOrBuy);
    }
  };

  //((new weight - old weight) *x* NAV) */* (price per share *x* FX rate)

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
        this.handleAlphaApiCurrency(this.state.currency);
      })
      .catch(err => console.log(err));
  };

  handleAlphaApiCurrency = query => {
    API.getExchange(query)
      .then(res => {
        console.log(res);

        const exchangerate = _.flattenDeep([
          res.data["Realtime Currency Exchange Rate"]
        ]);
        // console.log(exchangerate[0]["5. Exchange Rate"])
        this.setState({
          exchangerate: exchangerate[0]["5. Exchange Rate"]
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
    portfolios[index].changed = true;
    this.setState({
      data: portfolios
    });
    this.alertSomething(props);
  };

  //((new weight - old weight) *x* NAV) */* (price per share *x* FX rate)
  handleStageSubmit = () => {
    const portfolios = this.state.data;
    portfolios.map(element => {
      if (element.changed) {
        this.handleSaveStages(element);
      }
    });
  };

  handleSaveStages = data => {
    const save = {
      portfolio_manager: data.portfolio,
      ticker: this.state.ticker,
      portfolio: data.portfolio,
      old_weight: data.old_weight,
      new_weight: data.newWeight,
      shares_buy_sell: data.shares_buy_sell,
      buy_or_sell: data.buy_or_sell,
      ticker_name: this.state.tickerName
    };
    API.postStagingData(save)
      .then(res => {
        this.loadStagingData();
        this.loadPortfolios();
      })
      .catch(err => console.log(err));
    //console.log(this.state.stagingData);
  };

  getnewWeightValue = props => {
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    // console.log(index)
    return portfolios[index].newWeight;
  };

  render = () => {
    //console.log(this.state.data.length);
    // console.log(this.state.data);
    return (
      <Fabric>
        <div className="App">
          <div className="top">
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
            <SaveBtn handleStageSubmit={this.handleStageSubmit} />

            <StockList
              currency={this.state.currency}
              tickerName={this.state.tickerName}
              stockItems={this.state.stocks}
            />
          </div>
          {this.state.data.length ? (
            <ReactTable
              data={this.state.data}
              filterable
              defaultFilterMethod={(filter, row) =>
                String(row[filter.id]) === filter.value
              }
              columns={[
                {
                  //Header: "Name",
                  columns: [
                    {
                      Header: "ID",
                      id: "id",
                      accessor: "id",
                      show: false
                    },
                    {
                      Header: "Portfolio",
                      accessor: "portfolio",
                      maxWidth: 200,
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value) &&
                        row[filter.id].endsWith(filter.value)
                    },
                    {
                      Header: "NAV",
                      accessor: "NAV",
                      filterable: false,
                      maxWidth: 200
                    },
                    {
                      Header: "Current Cash(%)",
                      accessor: "current_cash",
                      filterable: false,
                      maxWidth: 200
                    },
                    {
                      Header: "Old Weight(%)",
                      accessor: "old_weight",
                      filterable: false,
                      maxWidth: 200
                    },
                    {
                      Header: "Shares Owned",
                      accessor: "shares_owned",
                      filterable: false,
                      maxWidth: 200
                    },
                    {
                      Header: "New Weight(%)",
                      filterable: false,
                      Cell: props => (
                        <div>
                          <input
                            type="text"
                            id="input1"
                            placeholder="%"
                            style={{
                              width: "50px"
                            }}
                            className="number"
                            value={this.getnewWeightValue(props)}
                            onChange={e => this.handleNewWeightChange(props, e)}
                          />
                        </div>
                      ),
                      maxWidth: 200
                    },
                    {
                      Header: "Shares to Buy/Sell",
                      accessor: "shares_buy_sell",
                      filterable: false,
                      maxWidth: 200
                    },
                    {
                      Header: "Buy OR Sell",
                      accessor: "buy_or_sell",
                      maxWidth: 200,
                    },
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
          <br />
          <br />
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
                      show: false
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
                      minWidth: 125
                    },
                    {
                      Header: "Ticker Name",
                      accessor: "ticker_name",
                      minWidth: 125
                    },
                    {
                      Header: "Delete",
                      Cell: props => (
                        <DeleteBtn onClick={() => this.deleteStaging(props)} />
                      )
                    }
                  ]
                }
              ]}
              //defaultPageSize={10}
              className="-striped -highlight"
              showPagination={false}
              pageSize={this.state.stagingData.length}
            />
          ) : (
            <h2>NoData</h2>
          )}

          <br />
          <br />
          <br />
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
