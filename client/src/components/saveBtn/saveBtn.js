import React from "react";
import "./saveBtn.css";

function SaveBtn(props) {
  return (
   
      <button className="recordButton" onClick={() => props.handleStageSubmit()}>
        Record Trades
      </button>
    
  );
}

export default SaveBtn;
