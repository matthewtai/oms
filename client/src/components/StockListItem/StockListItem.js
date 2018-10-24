import React from 'react';
import './StockListItem.css';

const StockListItem = (stock, props) => {

  return (
    <li className="StockListItem">
      <div className="StockListItem_Symbol"><span>symbol: </span>{ stock.symbol }</div>
      <div className="StockListItem_Price"><span>Price: </span>${ parseFloat(stock.price).toFixed(2) }</div>
      <div className="StockListItem_Volume"><span>Percent change: </span>{ parseFloat(stock.change).toFixed(4)}%</div>
    </li>
  )
}
export default StockListItem;
