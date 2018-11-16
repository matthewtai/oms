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
// import StagingTable from "../../components/StagingTable/StagingTable";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
// import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { initializeIcons } from "@uifabric/icons";
import SaveBtn from "../../components/saveBtn/saveBtn";
import DeleteBtn from "../../components/DeleteBtn";
import logo from "../Login/img/barlogo-01.png";
import matchSorter from "match-sorter";
import CloseSideBtn from "../../components/CloseSideBtn";
import HoldingsBtn from "../../components/holdingsBtn/holdingsBtn";
import ThemeButton from "../../components/themebtn/themebtn";
import SendButton from "../../components/sendBtn/sendBtn";

// import { elementContains } from "@uifabric/utilities";
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
    showsidebar: false,
    portfolioname: "",
    timer: 0
  };

  toggleSideBar = () => {
    this.setState({
      showsidebar: !this.state.showsidebar
    });

  };

  componentDidMount() {
    this.loadPortfolioStaging();
    this.handlePortfolioManager();
    this.handleAllHolding();
    setTimeout(this.autoRefresh, 5000);
    setTimeout(this.timeStamp, 1000);
    //this.autoRefresh();
  }
  timeStamp = () => {
    let currentTime = this.state.timer;
    currentTime++;
    this.setState({ timer: currentTime });
    setTimeout(this.timeStamp, 1000);
  };

  autoRefresh = () => {
    Promise.all([API.getPortfolios(), this.loadStagingData()]).then(res => {
      //console.log(res[0]);
      let refPortfolios = res[0].data;
      let portfolios = this.state.data;
      for(var i = 0; i < portfolios.length; i++){
        refPortfolios[i].newWeight = portfolios[i].newWeight;
        refPortfolios[i].changed = portfolios[i].changed; 
        refPortfolios[i].shares_buy_sell = portfolios[i].shares_buy_sell;
        refPortfolios[i].buy_or_sell = portfolios[i].buy_or_sell;
        refPortfolios[i].old_weight = portfolios[i].old_weight;
        refPortfolios[i].shares_owned = portfolios[i].shares_owned;
      }
      this.setState({
        data: refPortfolios,
        timer: 0
      });
      this.setupCurrentCash();
      //console.log("doing!");
    })
    .catch(err => console.log(err));
    
    setTimeout(this.autoRefresh, 5000);
  }

  loadPortfolioStaging(){
    Promise.all([this.loadPortfolios(), this.loadStagingData()]).then(res => {
      //console.log(res);
      this.setupCurrentCash();
    })
    .catch(err => console.log(err));
  }

  loadUsers = () => {
    API.getUsers()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  loadPortfolios = () => {
    return new Promise((resolve,reject)=>{
      API.getPortfolios()
      .then(res => {
        this.setupData(res.data);
        resolve(true);
      })
      .catch(err => reject(err));
    })
  };

  findHolding = tickerName => {
    API.getHoldings(tickerName)
      .then(res => {
        let mainData = this.state.data;
        //console.log(mainData);
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
    return new Promise((resolve,reject)=>{
      API.getStaging().then(res => {
        this.setState({
          stagingData: res.data
        });
        resolve(true);
      })
      .catch(err => reject(err));
    });
  };

  deleteStaging = props => {
    API.deleteStagingRow(props.original.id).then(res => {
      this.loadPortfolioStaging();
    });
  };

  handlePortfolioManager = () => {
    const manager = sessionStorage.name;
    this.setState({
      portfolio_manager: manager
    });
  };

  handleBuyOrSell = (index, weight, portfolio) => {
    const portfolios = portfolio[0].holdings ? this.state.holdingsData : this.state.data;
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


        const namecurrency = _.flattenDeep(res.data.bestMatches);
        this.setState({
          tickerName: namecurrency[0]["2. name"],
          currency: namecurrency[0]["8. currency"]
        });
        this.handleAlphaApiCurrency(this.state.currency);
      })
      .catch(err => console.log(err));
  };

  handleAlphaApiCurrency = query => {
    API.getExchange(query)
      .then(res => {
        const exchangerate = _.flattenDeep([
          res.data["Realtime Currency Exchange Rate"]
        ]);
        this.setState({
          exchangerate: exchangerate[0]["5. Exchange Rate"]
        });
        this.handleCurrentWeight();
      })
      .catch(err => console.log(err));
  };

  handleSubmit = () => {
    //console.log(this.state.value)
    this.performSearch(this.state.value);
    this.handleAlphaApi(this.state.value);
  };

  //((new weight - old weight) *x* NAV) */* (price per share *x* FX rate)
  handleStageSubmit = () => {
    const holdings = this.state.holdingsData;
    const portfolios = this.state.data
    portfolios.push(...holdings)
    //console.log(portfolios)
    portfolios.map(element => {
      if (element.changed) {
        this.handleSaveStages(element);
      }
    });
  };
  // user [...]
  handleSaveStages = data => {
    
    const save = {
      portfolio_manager: this.state.portfolio_manager,
      ticker: data.holdings ? data.ticker : this.state.ticker,
      portfolio: data.portfolio,
      old_weight: data.old_weight,
      new_weight: data.newWeight,
      shares_buy_sell: data.shares_buy_sell,
      buy_or_sell: data.buy_or_sell,
      ticker_name: data.holdings ? null : this.state.tickerName
    };

    API.postStagingData(save)
      .then(res => {
        this.loadPortfolioStaging();
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

  //   // for each trade, grab the portfolio and calculate new weight minus old weight 
  //   console.log(portfolio);
  //   // then subtract that number from that portfolio's current cash in the portfolio table's state (not the db!)

  };

  calculateShares = props => {
    //event.preventDefault();
    //console.log(props);
    const portfolios = props.original.holdings? this.state.holdingsData : this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    let weight =  portfolios[index].newWeight / 100 - portfolios[index].old_weight / 100;
    this.handleBuyOrSell(index, weight, portfolios);
    const price = props.original.holdings ? portfolios[index].closeprice : this.state.price;
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
    const portfolios = props.original.holdings ? this.state.holdingsData : this.state.data;
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
      //this.calculateShares(props);
    } else {
      this.setState({
        data: portfolios
      });
      //this.calculateShares(props);
    }
    if(parseInt(event.target.value)){
      this.calculateShares(props);
    }
  };

  getnewWeightValue = props => {
    const portfolios = props.original.holdings ? this.state.holdingsData : this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    return portfolios[index].newWeight;
    //this.setState
  };

  testing = () => {
    console.log("click works");
  };

  handleHoldingTable = props => { 
    
    if (this.state.showsidebar) {
      const portfolio = props.original.portfolio;
      const oldWeight = props.original.old_weight;
      const nav = props.original.NAV;
      this.setState({
        oldWeight: oldWeight,
        NAV: nav,
        portfolioname: portfolio
      });
      API.getHoldingsByPortfolio(portfolio)
        .then(res => {
          this.setupHoldingsData(res.data);
        })
        .catch(err => console.log(err));
  }
else{
    this.toggleSideBar();
    const portfolio = props.original.portfolio;
    const oldWeight = props.original.old_weight;
    const nav = props.original.NAV;
    this.setState({
      oldWeight: oldWeight,
      NAV: nav,
      portfolioname: portfolio
    });
    API.getHoldingsByPortfolio(portfolio)
      .then(res => {
        this.setupHoldingsData(res.data);    
      })
      .catch(err => console.log(err));
  };
  }
  
  showAllHoldings = () => {
    if (this.state.showsidebar){
    this.setState({
      portfolioname:"All Holdings"
    })
   
    API.aggregateHoldings()
      .then(res => {
        //console.log(res)
        this.setupHoldingsData(res.data);
      })
      .catch(err => console.log(err));
    }
      else
      { this.toggleSideBar(); this.setState({
        portfolioname:"All Holdings"
      })
     
      API.aggregateHoldings()
        .then(res => {
          //console.log(res)
          this.setupHoldingsData(res.data);
        })
        .catch(err => console.log(err));
      }
  };

  setupHoldingsData = data => {
    //console.log(data)
    data.map(element => {
      element.newWeight = "";
      element.changed = false;
      element.holdings = true;
      element.shares_buy_sell = 0;
      element.old_weight = this.state.oldWeight;
      element.NAV = this.state.NAV;
      element.buy_or_sell = "";
      // element.total_ticker_price = this.data.SUM;
    });
    this.setState({
      holdingsData: data
    });
  };

  handleAllHolding = () => {
    API.getAllHoldings()
      .then(res => {
        // console.log(res)
      })
      .catch(err => console.log(err));
  };

  //old weight
  handleCurrentWeight = () => {
    const portfolios = this.state.data;
    // const index = portfolios.findIndex(element => {
    //   return element.id === props.row.id;
    // });
    portfolios.map(element => {
      const shares = element.shares_owned;
      const nav = element.NAV;
      let currentWeight = (((shares * this.state.price * this.state.exchangerate) / nav) *100).toFixed(2);
      element.old_weight = currentWeight;
    })
    // const shares = portfolios[index].shares_owned;
    // const nav = portfolios[index].NAV;
    // let currentWeight = (((shares * this.state.price * this.state.exchangerate) / nav) *100).toFixed(2);
    this.setState({data : portfolios});
  };
  tickerClickSearch = (props) => {
    const value = props.value
    this.setState({
      value: value
    }, () =>{
      this.handleSubmit();
    });
  }
  //current cash
  setupCurrentCash = () => {
    let portfolios = this.state.data;
    let staging = this.state.stagingData;
    portfolios.map(element => {
      const nav = element.NAV;
      const cash = element.cash;
      let oldweight = 0;
      let newWeight = 0;
      staging.map(stagingItem => {
          if(stagingItem.portfolio === element.portfolio /*&& stagingItem.ticker_name === this.state.tickerName*/){
            oldweight += parseFloat(stagingItem.old_weight);
            newWeight += parseFloat(stagingItem.new_weight);
          }
        });
      element.currentCash = (((cash/nav)*100)-(newWeight-oldweight)).toFixed(2);
    });
    this.setState({data : portfolios});
  };

  render = () => {
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
            <div><StockList
              key={this.state.tickerName}
              currency={this.state.currency}
              tickerName={this.state.tickerName}
              stockItems={this.state.stocks}
            />
          </div>
          </div>
          
          <div className="buttonsdiv">
          
           <ThemeButton/>

           <SaveBtn handleStageSubmit={this.handleStageSubmit} />

           <HoldingsBtn
             className="holdingsButton"
             showAllHoldings={this.showAllHoldings}
           />
         </div>
        
         
        </div>
        {/* ==========================================            Table 1                  =============================== */}
        <div className = "wrapper">
        <div className={`tablesdiv ${sidebarvis}`}>
          <div className={` portfoliotablediv ${sidebarvis}`}><span className = "portfoliotablespan">Portfolios</span> 
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
                      accessor: "currentCash",
                      // Cell: props => {
                      //   return <span>{this.getCurrentCash(props)}</span>;
                      // },
                      filterable: false,
                      maxWidth: 200
                    },
                    {
                      Header: "Current Weight(%)",
                      accessor: "old_weight",
                      // Cell: props => {
                      //   return <span>{this.handleCurrentWeight(props)}</span>;
                      // },
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
          </div>
          
          {/* ======================================================= table 2 ======================================*/}

        <div className={` stagingtablediv ${sidebarvis}`}> <span className ="stagingtabletitlename"> Trade Orders  </span><span className="timer">
             <i className="ms-Icon ms-Icon--Clock" /> Last updated {this.state.timer} seconds ago
           </span>
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
                      minWidth: 100
                    },
                    {
                      Header: "Portfolio",
                      accessor: "portfolio",
                      minWidth: 100
                    },
                    {
                      Header: "Ticker",
                      accessor: "ticker",
                      minWidth: 100
                    },
                    {
                      Header: "Ticker Name",
                      accessor: "ticker_name",
                      minWidth: 100
                    },
                    {
                      Header: "Old Weight(%)",
                      accessor: "old_weight",
                      Cell: props => parseFloat(props.value).toFixed(2),
                      minWidth: 100
                    },
                    {
                      Header: "New Weight(%)",
                      accessor: "new_weight",
                      Cell: props => parseFloat(props.value).toFixed(2),
                      minWidth: 100
                    },
                    {
                      Header: "Shares to Buy/Sell",
                      accessor: "shares_buy_sell",
                      minWidth: 100
                    },
                    {
                      Header: "Buy Or Sell",
                      accessor: "buy_or_sell",
                      minWidth: 100
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
            <h2>No Trades Ordered</h2>
          )}
          <SendButton/></div> 
        </div>
          {/*======================================================= table 3 =======================================*/}

            <div className={`sideBar ${sidebarvis}`}>
            <span className = "tabletitlename">{this.state.portfolioname}</span> <CloseSideBtn onClick={() => this.toggleSideBar()} />
            {this.state.holdingsData.length ? (
              <ReactTable
              filterable
                data={this.state.holdingsData}
                columns={[
                  {
                    //Header: "Name",
                    columns: [
                      {
                        Header: "ID",
                        id: "id",
                        accessor: "id",
                        show: false,
                        minWidth: 125
                      },
                      {
                        Header: "Ticker",
                        id: "ticker",
                        accessor: d => d.ticker,
                        filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, {
                          keys: ["ticker"]
                        }),
                        Cell: props => (
                          <div
                            className="tickerBtn"
                            onClick={() => this.tickerClickSearch(props)}
                          >
                            {props.original.ticker}
                          </div>
                        ),
                        filterAll: true,
                        minWidth: 125
                      },
                      {
                        Header: "Shares Owned",
                        accessor: "SUM",
                        Cell: props => (
                          <div>
                            {props.original.portfolio ? props.original.shares:  props.original.SUM}
                          </div>
                        ),
                        minWidth: 125,
                        filterable: false
                      },
                      {
                        Header: "Notional ($)",
                        accessor: 0,
                        Cell: props => (
                          <div>
                            {props.original.portfolio ? (props.original.shares * props.original.closeprice).toFixed(2): (props.original.SUM * props.original.closeprice).toFixed(2)}
                          </div>
                        ),
                        minWidth: 125,
                        filterable: false
                      },
                    ]
                  }
                ]}
                //defaultPageSize={10}
                className="-striped -highlight companytable"
                showPagination={false}
                pageSize={this.state.holdingsData.length}
              />
            ) : (
              <h2>No Data</h2>
            )}
          </div>
        </div>
        
      
      </div> 
    );
  };
}

export default Main;
