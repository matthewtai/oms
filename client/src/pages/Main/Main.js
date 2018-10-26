import React, { Component } from "react";
import _ from "lodash";
//import axios from 'axios';
import SearchBar from "../../components/SearchBar/SearchBar";
import StockList from "../../components/StockList/StockList";
import StockListItem from "../../components/StockListItem/StockListItem";
import "./main.css";
import API from "../../utils/API";
import "react-table/react-table.css";
import ReactTable from "react-table";
import StagingTable from "../../components/StagingTable/StagingTable";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { initializeIcons } from "@uifabric/icons";

initializeIcons();

class Main extends Component {
  state = {
    stocks: [],
    term: null,
    value: "",
    price: 0,
    data: [],
    tickerName: "",
    currency: ""
  };

  componentDidMount() {
    this.loadPortfolios();
    //this.performSearch();
    // this.handleAlphaApi();
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
    });

    this.setState({
      data: data
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
    let newShares =
      ((portfolios[index].newWeight / 100 -
        portfolios[index].old_weight / 100) *
        portfolios[index].NAV) /
      (this.state.price * 1.3);
    return (portfolios[index].shares_buy_sell = newShares);
  };

  //((new weight - old weight) *x* NAV) */* (price per share *x* FX rate)

  performSearch = query => {
    API.getQuote(query)
      .then(res => {
        console.log(res.data["Global Quote"]["05. price"]);
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
          price: parseFloat(res.data["Global Quote"]["05. price"]).toFixed(2)
        });
        console.log(this.state.price);
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
        console.log(res);

        const namecurrency = _.flattenDeep(res.data.bestMatches);
        this.setState({
          tickerName: namecurrency[0]["2. name"],
          currency: namecurrency[0]["8. currency"]
        });
        console.log(this.state.namecurrency);
      })
      .catch(err => console.log(err));
  };

  handleSubmit = () => {
    this.performSearch(this.state.value);
    this.handleAlphaApi(this.state.value);
  };

  //this.handleClick = this.handleClick.bind(this);
  //handleChange = this.handleChange.bind(this);

  // handleSearchChange= () => {
  //   this.setState({
  //     value: this.value
  //   });
  // }

  handleNewWeightChange = (props, event) => {
    //console.log(props.target.value)
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    //console.log(event.target.value);
    portfolios[index].newWeight = event.target.value;
    this.setState({
      data: portfolios
    });
    this.alertSomething(props);
  };

  getnewWeightValue = props => {
    const portfolios = this.state.data;
    const index = portfolios.findIndex(element => {
      return element.id === props.row.id;
    });
    return portfolios[index].newWeight;
  };

  render = () => {
    //console.log(this.state.data.length);
    console.log(this.state.data);
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
                      accessor: "id"
                    },
                    {
                      Header: "Portfolio",
                      accessor: "portfolio"
                    },
                    {
                      Header: "NAV",
                      accessor: "NAV"
                    },
                    {
                      Header: "Starting Cash",
                      accessor: "cash"
                    },
                    {
                      Header: "Current Cash(%)",
                      accessor: "current_cash"
                    },
                    {
                      Header: "Old Weight(%)",
                      accessor: "old_weight"
                    },
                    {
                      Header: "New Weight",
                      Cell: props => (
                        <div>
                          <input
                            className="number"
                            value={this.getnewWeightValue(props)}
                            onChange={e => this.handleNewWeightChange(props, e)}
                          />
                        </div>
                      ),
                      minWidth: 200
                    },
                    {
                      Header: "Shares Owned",
                      accessor: "shares_owned"
                    },
                    {
                      Header: "Shares to Buy/Sell",
                      accessor: "shares_buy_sell"
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
        </div>
        {/* <StagingTable/> */}
      </Fabric>
    );
  };
}

export default Main;
