import React from "react";
import "./holdingsBtn.css";

function HoldingsBtn(props) {
  return (
    <div>
      <button className="btnn first" onClick={() => props.showAllHoldings()}>
        All Holdings
      </button>
    </div>
  );
}

export default HoldingsBtn;
