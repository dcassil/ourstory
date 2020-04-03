import axios from "axios";
import history from "@services/history";
import Authenticator from "@components/Authenticator";

const EXPIRED = "expired";

export default {
  ...axios,
  get: (route) => {
    return axios.get(route).catch(catchExpired);
  },
  post: (route, body) => {
    return axios.post(route, body).catch(catchExpired);
  },
  put: (route, body) => {
    return axios.put(route, body).catch(catchExpired);
  },
};

function catchExpired(resp) {
  let data = resp && resp.response && resp.response.data;

  if (data.reason === EXPIRED) {
    if (window.location.pathname !== "/login") {
      Authenticator.logout();
      history.push("/login");
    }

    console.log("catch expired", history);
  }
  //   return resp;
}
