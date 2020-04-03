import React, { PropTypes } from "react";
import { Route, Redirect } from "react-router-dom";
import Authenticator from "./Authenticator";

export default ({ component, ...rest }) => (
  <Route
    {...rest}
    render={function (props) {
      if (!Authenticator.isLoggedIn()) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }

      if (!Authenticator.isAuthorized(props.location.pathname)) {
        return (
          <div>
            <h1>Access denied</h1>
          </div>
        );
      }

      return React.createElement(component, props);
    }}
  />
);
