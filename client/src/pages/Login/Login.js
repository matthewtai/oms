import React, { Component } from "react";
// import { Col, Row, Container } from "../../components/Grid";
// import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import LoginBtn from "../../components/LoginBtn";
import "./Login.css";
import logo from "./img/barometer.png";
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
    console.log(this.state.userName);
  };

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  handleLogin = () => {
    const userInput = {
      userName: this.state.userName,
      password: this.state.password
    };
    console.log(userInput);
    API.postingLoginData(userInput).then( res => {
      // console.log(res);
      if (res.data !== null) {
        sessionStorage.name = res.data.firstName;
        window.location.href = "/oms";
      } else {
        console.log(`does not work`)
      }
      // console.log(res.data);
    }) 
      .catch(err => console.log(err));
  };

  render() {
    return (
      <form className="card centered" onSubmit={this.handleSubmit}>
        <div className="card-body">
          <img className="logo" alt="icon" src={logo} />
          <h2> Login </h2>
          <div className="form-group">
            <input
              className="form-control"
              type="userName"
              value={this.state.userName}
              onChange={this.handleUserNameChange}
              
            />
            <label for="user" class="label">Username</label>
          </div>
          
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
              <label for="password" class="label">Password</label>
          </div>
          <LoginBtn onClick={this.handleLogin} type="submit" />
        </div>
      </form>
    );
  }
}
