import React, { Component } from "react";
// import { Col, Row, Container } from "../../components/Grid";
// import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import LoginBtn from "../../components/LoginBtn"
import "./Login.css"
import Axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleUserNameChange = event => {
    this.setState({
      userName: event.target.value
    });
    console.log(this.state.userName)
  }

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  handleLogin = () => {
    const userInput = {
      userName: this.state.userName,
      password: this.state.password
    };
    Axios.post("login/accounts", userInput, function(data) {
      console.log(data);
      if (data !== null) {
        sessionStorage.id = data.id;
        console.log(sessionStorage.id);
        window.location.href = "/";
      } else {
        console.log(`does not work`)
      }
      console.log(data);
    });
  }

  render() {
    return (
      <form className = "card centered" onSubmit={this.handleSubmit}>
        <div className = "card-body">
            <h1> Login </h1>
          <div className="form-group">
            <input className="form-control"
            type="userName"
            value={this.state.userName}
            onChange={this.handleUserNameChange}
            />
          </div>
          <div className="form-group">
            <input className="form-control"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            />
          </div>
          <LoginBtn
          onClick = {this.handleLogin}     
          type= "submit"
          />
        </div>
      </form>
      );
  }
}