import React from "react";
import "./saveBtn.css";

function SaveBtn(props) {
  return (
    <div>
      <button className="btn first" onClick={() => props.handleStageSubmit()}>
        Record Trades
      </button>
    </div>
  );
}

export default SaveBtn;
