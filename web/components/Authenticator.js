import api from "@services/api";
import _ from "lodash";

function logout() {
  api.defaults.headers.common["Authorization"] = undefined;
  window.sessionStorage.removeItem("account");
}

const Authenticator = {
  syncAuthenticationStatus: function (callback) {
    console.log("starting sync call");
    const accountStr = window.sessionStorage.getItem("account");
    if (accountStr) {
      const account = JSON.parse(accountStr);
      api.defaults.headers.common["Authorization"] = "Bearer " + account.token;
    }

    api
      .get(API_URL + "/auth/sync")
      .then(function (response) {
        if (response.data.token) {
          window.sessionStorage.setItem(
            "account",
            JSON.stringify(response.data)
          );
          callback(true);
        } else {
          console.warn("no token in sync resp");
          logout();
          callback(false);
        }
      })
      .catch(function (error) {
        console.warn(error);
        // logout();
        callback(false);
      });
  },
  login: function (username, password, successCallback, errorCallback) {
    api
      .post(API_URL + "/auth/login", { username: username, password: password })
      .then(function (response) {
        api.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.token;
        console.log("login data", response.data);
        window.sessionStorage.setItem("account", JSON.stringify(response.data));
        successCallback && successCallback();
      })
      .catch(function (error) {
        errorCallback && errorCallback(error);
      });
  },
  logout: logout,
  isLoggedIn: function () {
    try {
      return !!JSON.parse(window.sessionStorage.getItem("account"));
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  isAuthorized: function (url) {
    try {
      const account = JSON.parse(window.sessionStorage.getItem("account"));
      let rule = this._getRule(url);
      return !(!account || _.intersection(account.roles, rule).length == 0);
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  setRules: function (rules) {
    this.rules = rules;
  },
  getAccount: function () {
    try {
      return JSON.parse(window.sessionStorage.getItem("account"));
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },
  _getRule(url) {
    if (this.rules[url]) {
      return this.rules[url];
    }

    let y = url.split("/");
    let key = Object.keys(this.rules).find((rule) => {
      let test = rule
        .split("/")
        .map((x, index) => (x.includes(":") ? y[index] : x))
        .join("/");

      return test === url;
    });

    return this.rules[key];
  },
};

export default Authenticator;
