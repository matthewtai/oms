import React from "react";
// import "./loginBtn.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
const LoginBtn = props => (
  <button className="login-btn btn" {...props}>
    Login
  </button>
);

export default LoginBtn;
