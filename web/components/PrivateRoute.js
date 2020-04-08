import React, { PropTypes } from "react";
import { Route, Redirect } from "react-router-dom";
import Authenticator from "./Authenticator";

export default ({ component, checkRoles, children, ...rest }) => (
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

      if (checkRoles && !Authenticator.isAuthorized(props.location.pathname)) {
        return (
          <Redirect
            to={{
              pathname: "/forbiden",
              state: { from: props.location },
            }}
          />
        );
      }

      return component
        ? React.createElement(component, props)
        : children(props);
    }}
  />
);
