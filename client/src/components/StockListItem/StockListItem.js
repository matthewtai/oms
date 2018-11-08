import React from 'react';
import './StockListItem.css';

const StockListItem = (stock, props) => {

return (
    <div className="StockListItem">
    <span className = "title">Ticker: </span><span className = "datainfo"> { stock.symbol }</span>
    <span className = "title">Company: </span><span className = "datainfo"> {stock.tickerName}  </span>
    <span className ="title">   Price: </span> <span className = "datainfo"> ${ parseFloat(stock.price).toFixed(2) }</span>
    <span className = "title">  % Change: </span><span className = "datainfo stockchange" style = {stock.change > "0" ? {color: '#39FF14'} : {color:'#bd3b54'}} > { parseFloat(stock.change).toFixed(4)}%</span>
    <span className = "title">Currency: </span><span className = "datainfo"> {stock.currency} </span>  
    </div>
    
  )
}
export default StockListItem;
