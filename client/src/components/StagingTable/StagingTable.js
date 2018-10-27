import React from 'react';
import 'react-table/react-table.css'
import ReactTable from "react-table";

const StagingTable = (props) =>{
    
    return(
        <ReactTable
        data={props}
        columns={[
            {
                Header: "Portfolio Manager",
                accessor: "portfolio_manager"
            },
            {
                Header: "Ticker",
                accessor: "ticker"
            },
            {
                Header: "Portfolio",
                accessor: "portfolio"
            },
            {
                Header: "Old Weight",
                accessor: "old_weight"
            },
            {
                Header: "New Weight",
                accessor: "new_weight",
            },
            {
                Header: "Shares to buy sell",
                accessor: "shares_buy_sell",
            },
            {
                Header: "Buy or Sell",
                accessor: "buy_or_sell",
            },
            {
                Header: "Ticker Name",
                accessor: "ticker_name",
            }]
        }
        //defaultPageSize={10}
        className="-striped -highlight"
        showPagination= {false}
        //defaultPageSize={this.state.data.length}
        
    />
)
}
export default StagingTable;
