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
import SaveBtn from "../../components/saveBtn/saveBtn";
import DeleteBtn from "../../components/DeleteBtn";
import logo from "../Login/img/barlogo-01.png";
import matchSorter from "match-sorter";
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
    ticker: "",
    portfolio_manager: "",
    holdingsData: [],
    oldWeight: 0,
    NAV: 0,
    showsidebar: false
  };

  toggleSideBar = () => {
    this.setState({
      showsidebar: !this.state.showsidebar
    });
  };

  componentDidMount() {
    this.loadPortfolios();
    //this.performSearch();
    //this.handleAlphaApi();
    this.loadStagingData();
    this.handlePortfolioManager();
    this.handleAllHolding();
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

  findHolding = tickerName => {
    API.getHoldings(tickerName)
      .then(res => {
        let mainData = this.state.data;
        console.log(mainData);
        mainData.map(main => {
          let index = res.data.findIndex(obj => {
            return obj.portfolio === main.portfolio;
          });
          //console.log(index);
          if (index > -1) {
            main.shares_owned = res.data[index].shares;
          } else {
            main.shares_owned = 0;
          }
        });
        //console.log(mainData);
        this.setState({ data: mainData });
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

  handlePortfolioManager = () => {
    const manager = sessionStorage.name;
    this.setState({
      portfolio_manager: manager
    });
  };

  handleBuyOrSell = (index, weight, portfolio) => {
    const portfolios = portfolio[0].holdings
      ? this.state.holdingsData
      : this.state.data;
    console.log(portfolio);
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
        console.log(stocks);
        this.setState({
          ticker: res.data["Global Quote"]["01. symbol"],
          price: parseFloat(res.data["Global Quote"]["05. price"]).toFixed(2)
        });
        this.findHolding(this.state.ticker);
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
        console.log(namecurrency);
        // console.log(this.state.currency);
        this.handleAlphaApiCurrency(this.state.currency);
      })
      .catch(err => console.log(err));
  };

  handleAlphaApiCurrency = query => {
    API.getExchange(query)
      .then(res => {
        //console.log(res);

        const exchangerate = _.flattenDeep([
          res.data["Realtime Currency Exchange Rate"]
        ]);
        console.log(exchangerate);
        this.setState({
          exchangerate: exchangerate[0]["5. Exchange Rate"]
        });
        //console.log(this.state.exchangerate);
      })
      .catch(err => console.log(err));
  };

  handleSubmit = () => {
    this.performSearch(this.state.value);
    this.handleAlphaApi(this.state.value);
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
      portfolio_manager: this.state.portfolio_manager,
      ticker: this.state.ticker,
      portfolio: data.portfolio,
      old_weight: data.old_weight,
      new_weight: data.newWeight,
      shares_buy_sell: data.shares_buy_sell,
      buy_or_sell: data.buy_or_sell,
      ticker_name: this.state.tickerName
    };
    console.log("this is : " + this.state.portfolio_manager);
    API.postStagingData(save)
      .then(res => {
        this.loadStagingData();
        this.loadPortfolios();
        // this.loadCashUpdate();
      })
      .catch(err => console.log(err));
  };

  loadCashUpdate = props => {
    const trades = this.state.stagingData;
    const index = trades.findIndex(element => {
      return element.id === props.row.id;
    });

    const portfolio = trades[index].portfolio;
    const oldWeight = trades[index].old_weight;
    const newWeight = trades[index].new_weight;

    // for each trade, grab the portfolio and calculate new weight minus old weight 
    console.log(portfolio);
    // then subtract that number from that portfolio's current cash in the portfolio table's state (not the db!)

  };

  calculateShares = props => {
    //event.preventDefault();
    console.log(props);
    const portfolios = props.original.holdings
      ? this.state.holdingsData
      : this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    // let newShares = portfolios[index].cash*(portfolios[index].newWeight/100);
    // console.log(this.state.price);
    let weight =
      portfolios[index].newWeight / 100 - portfolios[index].old_weight / 100;
    this.handleBuyOrSell(index, weight, portfolios);
    // console.log(weight)
    const price = props.original.holdings
      ? portfolios[index].closeprice
      : this.state.price;
    if (weight < 0) {
      let newShares =
        (Math.abs(weight) * portfolios[index].NAV) /
        (price * this.state.exchangerate);
      return (portfolios[index].shares_buy_sell =
        Math.round(newShares / 100) * 100);
    } else {
      let newShares =
        (weight * portfolios[index].NAV) / (price * this.state.exchangerate);
      return (portfolios[index].shares_buy_sell =
        Math.round(newShares / 100) * 100);
    }
  };

  handleNewWeightChange = (props, event) => {
    const portfolios = props.original.holdings
      ? this.state.holdingsData
      : this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    // console.log(event.target.value);
    portfolios[index].newWeight = event.target.value;
    //come back to this
    portfolios[index].changed = true;

    if (props.original.holdings) {
      this.setState({
        holdingsData: portfolios
      });
      this.calculateShares(props);
    } else {
      this.setState({
        data: portfolios
      });
      this.calculateShares(props);
    }
  };

  getnewWeightValue = props => {
    const portfolios = props.original.holdings
      ? this.state.holdingsData
      : this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    // console.log(index)
    return portfolios[index].newWeight;
  };

  testing = () => {
    console.log("click works");
  };

  handleHoldingTable = props => {
    this.toggleSideBar();
    const portfolio = props.original.portfolio;
    const oldWeight = props.original.old_weight;
    const nav = props.original.NAV;
    // console.log(oldWeight)
    this.setState({
      oldWeight: oldWeight,
      NAV: nav
    });
    API.getHoldingsByPortfolio(portfolio)
      .then(res => {
        // console.log(res.data);
        this.setupHoldingsData(res.data);
      })
      .catch(err => console.log(err));
  };

  setupHoldingsData = data => {
    data.map(element => {
      element.newWeight = "";
      element.changed = false;
      element.holdings = true;
      element.shares_buy_sell = 0;
      element.old_weight = this.state.oldWeight;
      element.NAV = this.state.NAV;
      element.buy_or_sell = "";
    });
    this.setState({
      holdingsData: data
    });
    // console.log(this.state.data)
    console.log(this.state.holdingsData);
  };

  handleAllHolding = () => {
    API.getAllHoldings()
      .then(res => {
        // console.log(res)
      })
      .catch(err => console.log(err));
  };

  handleCurrentWeight = props => {
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    const shares = portfolios[index].shares_owned;
    const nav = portfolios[index].NAV;
    let currentWeight = (
      ((shares * this.state.price * this.state.exchangerate) / nav) *
      100
    ).toFixed(2);
      
    return currentWeight;
  };

  getCurrentCash = props => {
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    const nav = portfolios[index].NAV;
    const cash = portfolios[index].cash;
    return ((cash / nav) * 100).toFixed(2);
  };
  render = () => {
    //console.log(this.state.data.length);
    // console.log(this.state.data);
    const sidebarvis = this.state.showsidebar ? "show" : "hide";
    return (
      <div className="App">
        <div className="top">
          <div className="SearchandImage">
            <div className="logodiv">
              <img className="logoMain" alt="icon" src={logo} />
            </div>

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
          </div>
          <div className="savebuttondiv">
            <SaveBtn handleStageSubmit={this.handleStageSubmit} />
          </div>

          <StockList
            currency={this.state.currency}
            tickerName={this.state.tickerName}
            stockItems={this.state.stocks}
          />
        </div>
        {/* ==========================================            Table 1                  =============================== */}
        <div className="tableandbar">
          {this.state.data.length ? (
            <ReactTable
              data={this.state.data}
              filterable
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
                      id: "portfolio",
                      accessor: d => d.portfolio,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, {
                          keys: ["portfolio"]
                        }),
                      filterAll: true,
                      Cell: props => (
                        <div
                          className="portfolioBtn"
                          onClick={() => this.handleHoldingTable(props)}
                        >
                          {props.original.portfolio}
                        </div>
                      ),
                      maxWidth: 200
                    },
                    {
                      Header: "NAV",
                      accessor: "NAV",
                      filterable: false
                    },
                    {
                      Header: "Current Cash(%)",
                      accessor: "cash",
                      Cell: props => {
                        return <span>{this.getCurrentCash(props)}</span>;
                      },
                      filterable: false,
                      maxWidth: 200
                    },
                    {
                      Header: "Current Weight(%)",
                      accessor: "old_weight",
                      Cell: props => {
                        return <span>{this.handleCurrentWeight(props)}</span>;
                      },
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
                      filterable: false
                    }
                  ]
                }
              ]}
              //defaultPageSize={10}
              className={` -striped -highlight portfoliotable ${sidebarvis}`}
              showPagination={false}
              defaultPageSize={this.state.data.length}
            />
          ) : (
            <h2>NoData</h2>
          )}
          {/*======================================================= table 2 =======================================*/}

          <div className={`sideBar ${sidebarvis}`}>
            CALL PORTFOLIO NAME HERE
            {this.state.holdingsData.length ? (
              <ReactTable
                data={this.state.holdingsData}
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
                        Header: "Tickers",
                        accessor: "ticker"
                      },
                      {
                        Header: "Shares Owned",
                        accessor: "shares"
                      },
                      {
                        Header: "Closing Price",
                        accessor: "closeprice"
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
                              onChange={e =>
                                this.handleNewWeightChange(props, e)
                              }
                            />
                          </div>
                        )
                      },
                      {
                        Header: "Shares to Buy/Sell",
                        accessor: "shares_buy_sell",
                        filterable: false
                      },
                      {
                        Header: "Buy Or Sell",
                        accessor: "buy_or_sell",
                        filterable: false
                      }
                    ]
                  }
                ]}
                //defaultPageSize={10}
                className="-striped -highlight"
                showPagination={true}
                pageSize={15}
              />
            ) : (
              <h2>NoData</h2>
            )}
          </div>
        </div>
        {/* ======================================================= table 3 ======================================*/}

        <div className="stagingtable">Staging Table
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
                      Header: "Portfolio Manager",
                      accessor: "portfolio_manager",
                      minWidth: 125
                    },
                    {
                      Header: "Portfolio",
                      accessor: "portfolio",
                      minWidth: 125
                    },
                    {
                      Header: "Ticker",
                      accessor: "ticker",
                      minWidth: 125
                    },
                    {
                      Header: "Ticker Name",
                      accessor: "ticker_name",
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
                      Header: "Delete",
                      Cell: props => (
                        <DeleteBtn onClick={() => this.deleteStaging(props)} />
                      )
                    }
                  ]
                }
              ]}
              //defaultPageSize={10}
              className="-striped -highlight stagingtable"
              showPagination={false}
              pageSize={this.state.stagingData.length}
            />
          ) : (
            <h2>No Data</h2>
          )}
        </div>
      </div>
    );
  };
}

export default Main;
