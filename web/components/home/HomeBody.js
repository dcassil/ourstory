import React from "react";
import { Link } from "react-router-dom";
import Authenticator from "../Authenticator";
import globalStyles from "../global.css";
import WhatsNew from "./whatsNew/WhatsNewView";

export default class HomeView extends React.Component {
  render() {
    if (Authenticator.isLoggedIn()) {
      return (
        <div className={globalStyles.basicWrapper}>
          <div className={globalStyles.basicBody}>
            <div className={globalStyles.basicColumn}>
              <WhatsNew />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={globalStyles.basicWrapper}>
          <div className={globalStyles.basicBody}>
            <div className={globalStyles.basicColumn}>
              This is home - Not logged in
            </div>
          </div>
        </div>
      );
    }
  }
}
