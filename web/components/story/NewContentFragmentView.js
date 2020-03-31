import React from "react";
import axios from "axios";
import Authenticator from "../Authenticator";

import { Link, Redirect } from "react-router-dom";
import {
  Form,
  Button,
  Checkbox,
  Container,
  Card,
  TextArea,
  Dimmer,
  Loader
} from "semantic-ui-react";

export default class NewStoryContentView extends React.Component {
  constructor(props) {
    super(props);
    this.values = {};
    this.state = { loading: true };
  }
  componentDidMount() {
    axios.get(API_URL + "/story", story).then(response => {
      this.setState({ story: response.data, loading: false });
    });
  }
  handleChange = target => {
    this.values[target.name] = target.value;
  };
  handleNext = () => {
    if (!this.values.terms) {
      alert("You must agree to the terms of service");
      return;
    }
    this.setState({ storySet: true });
  };
  handleSubmit = () => {
    let user = Authenticator.getAccount();
    let story = {
      title: this.values.title,
      author: { id: user.id, displayName: user.displayName },
      seed: this.values.seed,
      fragment: this.values.fragment,
      createdDate: new Date().getTime()
    };
    axios
      .post(API_URL + "/story", story)
      .then(response => {
        console.log(response);
        this.setState({ succussId: true });
      })
      .catch(error => {
        this.setState({
          failMessage: error.response ? error.response.data : error.message,
          storySet: false
        });
      });
  };
  renderFragmentForm() {
    if (this.state.loadgin) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <Card.Content>
        <Container>
          <p>{this.state.story.lastContent.topFragment.fragment}</p>
        </Container>
        <Form>
          <Form.Field key="fragment" name="fragment">
            <label>Fragment</label>
            <TextArea
              name="fragment"
              style={{ minHeight: 100 }}
              onChange={e => this.handleChange(e.target)}
              placeholder="As the creator, you get to add the first fragment as well, this will help to point your story in the direction you want"
            />
          </Form.Field>
          <Button type="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </Form>
      </Card.Content>
    );
  }
  renderStoryForm() {
    return (
      <Card.Content>
        <Form>
          <Form.Field name="title">
            <label>Title</label>
            <input
              name="title"
              onChange={e => this.handleChange(e.target)}
              placeholder="Setting a good title can help direct the path the story takes"
            />
          </Form.Field>
          <Form.Field>
            <label>Seed</label>
            <input
              name="seed"
              onChange={e => this.handleChange(e.target)}
              placeholder="What are the opening few lines of the story?"
            />
          </Form.Field>
          <Form.Field required>
            <Checkbox
              name="terms"
              onChange={e =>
                this.handleChange({
                  name: "terms",
                  value: !this.values.terms
                })
              }
              label="I agree to the Terms and Conditions"
            />{" "}
            <Link className="" to="/terms">
              see them here
            </Link>
          </Form.Field>
          <Button type="submit" onClick={this.handleNext}>
            Next
          </Button>
        </Form>
      </Card.Content>
    );
  }
  render() {
    if (this.state.succussId) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { from: "story/new" }
          }}
        />
      );
    }
    if (this.state.storySet) {
      return (
        <Container text>
          <Card fluid>{this.renderFragmentForm()}</Card>
        </Container>
      );
    }
    return (
      <Container text>
        <Card fluid>{this.renderStoryForm()}</Card>
      </Container>
    );
  }
}
