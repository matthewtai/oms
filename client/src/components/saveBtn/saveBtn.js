import React from "react";
import "./saveBtn.css";

function SaveBtn(props) {
  return (
    <div>
      <button className="btnn first" onClick={() => props.handleStageSubmit()}>
        Record Trades
      </button>
    </div>
  );
}

export default SaveBtn;
