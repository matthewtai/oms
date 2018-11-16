import React from "react";
import "./rebalanceBtn.css";

function RebalanceBtn(props) {
  return (
   
      <button className="rebalanceButton" onClick={() => props.handleStageSubmit()}>
        Rebalance
      </button>
    
  );
}

export default RebalanceBtn;
