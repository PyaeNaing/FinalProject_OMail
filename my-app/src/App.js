import React, { Component } from "react";
import { Switch, BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";
import Mail from "./mail";
import Login from "./Login";


class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>

            <Route
              path="/"
              render={() =>
                this.props.logged ? <Login /> :  <Mail /> 
              }
            />
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/logged" component={Mail} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      logged: state.userReducer.logged
    };
  };
  
  const mapDispatchToProps = { };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(App);
