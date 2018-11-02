import React from "react";
import "./DeleteBtn.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
const DeleteBtn = props => (
  <button className="delete-btn" {...props}>
   <i class="ms-Icon ms-Icon--Delete" aria-hidden="true"></i>
  </button>
);

export default DeleteBtn;
