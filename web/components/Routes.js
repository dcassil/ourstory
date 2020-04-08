import React, { PropTypes } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import PrivateRoute from "@components/PrivateRoute";
import Authenticator from "./Authenticator";
import HomeView from "./home/HomeView";
import AdminView from "./admin/AdminView";
import LoginView from "./login/LoginView";
import SignupView from "./signup/SignupView";
import NewStory from "./story/NewStoryView";
// import NewStoryContent from "./story/NewStoryContentView";
// import NewContentFragmentView from "./story/NewContentFragmentView";
import StoryView from "./story/StoryView";
import Header from "./Header";
import globalStyles from "./global.css";

Authenticator.setRules({
  "/admin": ["ADMIN"],
});

export default (
  <div>
    <Router>
      <div id="3">
        <Header />
        <div id="4" className={globalStyles.basicWrapper}>
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/login" component={LoginView} />
            <Route exact path="/signup" component={SignupView} />
            <PrivateRoute exact path="/story/new" component={NewStory} />
            <Route path="/story/:id" component={StoryView} />
          </Switch>

          {/* <Route
            exact
            path="/story/:id/content/new"
            component={NewStoryContent}
          />
          <Route
            exact
            path="/story/:id/content/:id/fragment/new"
            component={NewContentFragmentView}
          /> */}
          <PrivateRoute path="/admin" component={AdminView} />
        </div>
      </div>
    </Router>
  </div>
);
