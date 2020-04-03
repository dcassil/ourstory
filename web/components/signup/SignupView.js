"use strict";

import React from "react";
import { Redirect } from "react-router-dom";
import Authenticator from "../Authenticator";
import api from "@services/api";
import moment from "moment";
import CSSModules from "react-css-modules";
import styles from "./signup.css";

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginFail: false,
      loginFailMessage: ""
    };
  }

  handleChange(e) {
    this.setState({ loginFail: false });
    this.setState({ [e.target.name]: e.target.value });
  }

  createAccount(evt) {
    evt.preventDefault();

    evt.preventDefault();

    const that = this;

    const newAccount = {
      username: that.state.username,
      password: that.state.password
    };

    api
      .post(API_URL + "/signup", newAccount)
      .then(function(response) {
        that.resetState();
        that.props.onChange();
        that.setState({ failMessage: "" });
      })
      .catch(function(error) {
        that.setState({
          failMessage: error.response ? error.response.data : error.message
        });
      });

    if (this.state.username && this.state.password) {
      const that = this;
      Authenticator.login(
        this.state.username,
        this.state.password,
        function() {
          that.setState({ loginFail: false });
        },
        function(error) {
          let msg = "";
          if (error.response) {
            if (error.response.status == 429) {
              const time = moment(
                error.response.data.error.nextValidRequestDate
              );
              msg = "Try again " + time.fromNow();
            } else {
              msg = error.response.data.error;
            }
          } else {
            msg = error.message;
          }
          that.setState({ loginFail: true, loginFailMessage: msg });
        }
      );
    }
  }

  render() {
    if (Authenticator.isLoggedIn()) {
      return <Redirect to={{ pathname: "/" }} />;
    } else {
      return (
        <div className="container">
          <form styleName="form">
            <h2 styleName="form-heading">Create a new Account</h2>
            <div
              className={
                "form-group " + (this.state.loginFail ? "has-error" : "")
              }
            >
              <label htmlFor="inputUsername" className="sr-only">
                Username
              </label>
              <input
                type="text"
                id="inputUsername"
                name="username"
                value={this.state.username}
                className="form-control"
                placeholder="your@email.com"
                required
                autoFocus
                onChange={this.handleChange.bind(this)}
              />
            </div>
            <div
              className={
                "form-group " + (this.state.loginFail ? "has-error" : "")
              }
            >
              <label htmlFor="inputPassword" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="inputPassword"
                name="password"
                value={this.state.password}
                className="form-control"
                placeholder="Password"
                required
                onChange={this.handleChange.bind(this)}
              />
            </div>
            {this.state.loginFail && (
              <div className="alert alert-danger" role="alert">
                {this.state.loginFailMessage}
              </div>
            )}
            <button
              className="btn btn-lg btn-primary btn-block"
              type="submit"
              onClick={this.createAccount.bind(this)}
            >
              Create Account
            </button>
            <div className="secondary-text-group">
              <p className="secondary-text">
                Already have an account? <a href="/login">sign in here</a>
              </p>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default CSSModules(LoginView, styles);
