import React from "react";
import "./holdingsBtn.css";

function HoldingsBtn(props) {
  return (
    
      <button className="holdingsButton btnn first" onClick={() => props.showAllHoldings()}>
        All Holdings
      </button>
    
  );
}

export default HoldingsBtn;
