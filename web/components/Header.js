import React from "react";
import { Link } from "react-router-dom";
import Authenticator from "./Authenticator";
import globalStyles from "./global.css";
import styles from "./header.css";

export default class Header extends React.Component {
  render() {
    if (Authenticator.isLoggedIn()) {
      let isAdmin = Authenticator.isAuthorized("/admin");

      return (
        <div className={styles.header}>
          <div className={styles.headerGroup}>
            <p className={styles.headerText}>MENU</p>
            <p className={styles.headerText}>
              Hello, {Authenticator.getAccount().username}
            </p>
          </div>
          <div className={styles.headerGroup}>
            <p className={styles.headerText}>
              <Link
                className={globalStyles.textBold}
                onClick={Authenticator.logout}
                to="/"
              >
                Log Out
              </Link>
              {isAdmin && " or "}
              {isAdmin && (
                <Link className={globalStyles.textItalics} to="/admin">
                  Admin
                </Link>
              )}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.header}>
          <div className={styles.headerGroup}>
            <p className={styles.headerText}>Welcome to Our Story</p>
          </div>
          <div className={styles.headerGroup}>
            <Link className={globalStyles.textBold} to="/login">
              Sign In
            </Link>{" "}
            or{" "}
            <Link className={globalStyles.textItalics} to="/signup">
              Create a new Account
            </Link>
          </div>
        </div>
      );
    }
  }
}
