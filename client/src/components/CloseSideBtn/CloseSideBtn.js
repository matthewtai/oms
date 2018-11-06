import React from "react";
import "./CloseSideBtn.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
const CloseSideBtn = props => (
  <button className="closeside-btn" {...props}>
   <i className="ms-Icon ms-Icon--ChromeClose
" />
  </button>
);

export default CloseSideBtn;
