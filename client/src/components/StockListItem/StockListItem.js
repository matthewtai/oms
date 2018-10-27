import React from 'react';
import './StockListItem.css';

const StockListItem = (stock, props) => {

return (
    <div className="StockListItem">
    <span className = "title">Ticker: </span>{ stock.symbol }
    <span className = "title">Company: </span> {stock.tickerName}  
    <span className ="title">   Price: </span> ${ parseFloat(stock.price).toFixed(2) }
    <span className = "title">  % Change: </span> <span style = {stock.change > "0" ? {color: 'green'} : {color:'red'}}>{ parseFloat(stock.change).toFixed(4)}%</span>
    <span className = "title">Currency: </span> {stock.currency}  
    </div>
    
  )
}
export default StockListItem;
