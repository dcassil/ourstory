import React from "react";
import { Link } from "react-router-dom";
import Authenticator from "../Authenticator";

export default class HomeView extends React.Component {
  render() {
    if (Authenticator.isLoggedIn()) {
      return (
        <div className="basic-wrapper">
          <div className="basic-body"></div>
        </div>
      );
    } else {
      return (
        <div className="basic-wrapper">
          <div className="basic-body">
            Please <Link to="/login">login</Link> first.
          </div>
        </div>
      );
    }
  }
}
