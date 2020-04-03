import React from "react";
import { Link } from "react-router-dom";
import Authenticator from "../Authenticator";
import globalStyles from "../global.css";
import WhatsNew from "./whatsNew/WhatsNewView";

export default class HomeView extends React.Component {
  render() {
    return (
      <div className={globalStyles.storyPanel}>
        <div className={globalStyles.storyColumn}>
          <WhatsNew />
        </div>
      </div>
    );
  }
}
