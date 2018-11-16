import React from "react";
import "./themebtn.css";

function themeButton(props) {
  return (
   
      <button className="themeButton" onClick={() => props.handleStageSubmit()}>
         <i className="ms-Icon ms-Icon--Settings" />
      </button>
    
  );
}

export default themeButton;
