import React from "react";
import { Link } from "react-router-dom";
import Authenticator from "./Authenticator";
import globalStyles from "./global.css";
import styles from "./header.css";

export default class Header extends React.Component {
  render() {
    if (Authenticator.isLoggedIn()) {
      return (
        <div>
          <div className="container">
            <ul className="nav nav-pills">
              <li className="navbar-left">
                <p className="navbar-text">
                  Hello, {Authenticator.getAccount().username}
                </p>
              </li>
              <li className="navbar-right">
                <a href="/" onClick={Authenticator.logout}>
                  Logout
                </a>
              </li>
              {Authenticator.isAuthorized("/admin") && (
                <li className="navbar-right">
                  <Link to="/admin">Admin</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.header}>
          <div>
            <p className="navbar-text">Welcome to Our Story</p>
          </div>
          <div>
            <p className="navbar-text">
              <Link className={globalStyles.textBold} to="/login">
                Sign In
              </Link>{" "}
              or{" "}
              <Link className={globalStyles.textItalics} to="/signup">
                Create a new Account
              </Link>
            </p>
          </div>
        </div>
      );
    }
  }
}
