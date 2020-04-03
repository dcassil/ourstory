import React from "react";
import api from "@services/api";
import Authenticator from "../Authenticator";
import ContentForm from "./forms/ContentForm.js";

import { Link, Redirect } from "react-router-dom";
import {
  Form,
  Button,
  Checkbox,
  Container,
  Card,
  TextArea,
  Dimmer,
  Loader,
} from "semantic-ui-react";

export default class NewStoryContentView extends React.Component {
  constructor(props) {
    super(props);
    this.values = {};
    this.state = { loading: true };
    this.id = props.match.params.id;
    console.log(props.match);
  }
  componentDidMount() {
    api.get(API_URL + "/story", { id: this.id }).then((response) => {
      this.setState({ story: response.data, loading: false });
    });
  }
  handleSubmit = (content) => {
    let user = Authenticator.getAccount();
    let story = {
      ...content,
      author: { id: user.id, displayName: user.displayName },
      fragment: this.values.fragment,
      createdDate: new Date().getTime(),
    };
    api
      .post(`${API_URL}/story/${this.id}/content`, story)
      .then((response) => {
        console.log(response);
        this.setState({ succussId: true });
      })
      .catch((error) => {
        this.setState({
          failMessage: error.response ? error.response.data : error.message,
          storySet: false,
        });
      });
  };

  render() {
    if (this.state.loadgin) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <Container text>
        <Card fluid>
          <ContentForm onFormSubmit={this.handleSubmit} />
        </Card>
      </Container>
    );
  }
}
