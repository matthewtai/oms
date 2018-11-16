import React from "react";
import "./sendBtn.css";

function sendButton(props) {
  return (
   
      <button className="sendButton" onClick={() => props.handleStageSubmit()}>
         <i className="ms-Icon ms-Icon--Send" />
      </button>
    
  );
}

export default sendButton;
