import React from "react";
import { Link } from "react-router-dom";
import Authenticator from "./Authenticator";
import globalStyles from "./global.css";
import styles from "./header.css";
import { Menu, Icon, Dropdown } from "semantic-ui-react";

export default class Header extends React.Component {
  render() {
    let isLoggedIn = Authenticator.isLoggedIn();
    let isAdmin = Authenticator.isAuthorized("/admin");

    return (
      <div className={styles.header}>
        <Menu>
          <Dropdown item icon="bars">
            <Dropdown.Menu className={styles.primaryMenu}>
              <Dropdown.Header>Text Size</Dropdown.Header>
              <Dropdown.Item>Small</Dropdown.Item>
              <Dropdown.Item>Medium</Dropdown.Item>
              <Dropdown.Item>Large</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            {" "}
            <p className={styles.headerText}>
              {isLoggedIn
                ? `Hello, ${Authenticator.getAccount().username}`
                : `Welcome to Our Story`}
            </p>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              {isLoggedIn ? (
                <Link
                  className={globalStyles.textBold}
                  onClick={Authenticator.logout}
                  to="/"
                >
                  Log Out
                </Link>
              ) : (
                <Link className={globalStyles.textBold} to="/login">
                  Sign In
                </Link>
              )}
            </Menu.Item>
            {!isLoggedIn ? (
              <Menu.Item>
                <Link className={globalStyles.textItalics} to="/signup">
                  Create a new Account
                </Link>
              </Menu.Item>
            ) : null}
            {isAdmin && (
              <Menu.Item>
                <Link className={globalStyles.textItalics} to="/admin">
                  Admin
                </Link>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Menu>
      </div>
    );

    if (Authenticator.isLoggedIn()) {
    } else {
      return (
        <Menu>
          <Dropdown icon="bars" item>
            <Dropdown.Menu className={styles.primaryMenu}>
              <Dropdown.Header className={styles.menuItem}>
                Text Size
              </Dropdown.Header>
              <Dropdown.Item className={styles.menuItem}>Small</Dropdown.Item>
              <Dropdown.Item className={globalStyles.textWhite}>
                Medium
              </Dropdown.Item>
              <Dropdown.Item className={globalStyles.textWhite}>
                Large
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            <p className={styles.headerText}>Welcome to Our Story</p>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Link className={globalStyles.textBold} to="/login">
                Sign In
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link className={globalStyles.textItalics} to="/signup">
                Create a new Account
              </Link>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      );
    }
  }
}
