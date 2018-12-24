import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from "axios";
import "./Login.css";

import { connect } from "react-redux";
import { loginRequest } from "./redux/action";

class Login extends Component {
  constructor(props) {
    super(props);
    this.routeChange = this.routeChange.bind(this);
    this.state = {
      email: "",
      password: "",
      cur_User: "",
      islogged: false
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  createUser = e => {
    axios({
      method: "POST",
      url: "/create",
      data: {
        user: this.state.email,
        password: this.state.password
      }
    })
      .then(res => {
        console.log(res);
        if (!res.data) {
          alert("Username already in use.");
        }
      })
      .catch(e => {
        console.log(e);
      });
    this.setState({
      email: "",
      password: ""
    });
  };


  routeChange(){
    if(this.state.islogged)
    {
      let path = `logged`;
      this.props.history.push(path);
    }
    };

  loginCheck = e => {
    axios({
      method: "POST",
      url: "/login",
      data: {
        user: this.state.email,
        password: this.state.password
      }
    })
      .then(res => {
        console.log(res);
        if (res.data) {
          if(this.state.cur_User === "easteregg") { 
            window.location.href = 'http://csc412sfsu.com/~pnaing/Game.html';
          }
            this.props.loginRequest(this.state.cur_User);
            this.state.islogged = true;
        } else {
          alert("Username or Password is incorrect");
        }
      }).then(
        this.routeChange
      )
      .catch(e => {
        console.log(e);
      });
    this.setState({
      cur_User: this.state.email,
      email: "",
      password: ""
    });
  };

  displayLog = e => {
    console.log(this.props.logged);
    console.log(this.props.currentUser);
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  displayScreenLog = e => {
    if (this.setState.state) {
      alert("Username already in use.");
    }
  };

  render() {
    return (
      <div className="Login">
        <h1 className="red ui header">
          <i className="envelope open outline icon" />O-mail
        </h1>
        <form onSubmit={this.handleSubmit} className="login-panel">
          <FormGroup controlId="email" bsSize="large" className="email">
            <ControlLabel>Email:</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large" className="password">
            <ControlLabel>Password:</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button className="ui primary button login"
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            onClick={this.loginCheck}
          >
            Login
          </Button>
          <Button className="ui secondary button create"
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            onClick={this.createUser}
          >
            Create User
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.userReducer.email
  };
};

const mapDispatchToProps = { loginRequest };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
