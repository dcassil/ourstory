import React from "react";
import api from "@services/api";
import Authenticator from "../Authenticator";
import styles from "./Story.css";

import { Link, Redirect } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Container,
  Card,
  TextArea,
  Label,
} from "semantic-ui-react";

export default class NewStoryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      values: { title: "", seed: "", terms: false, fragment: "" },
    };
    this.user = Authenticator.getAccount();
  }
  componentDidMount() {}
  handleChange = (target) => {
    this.setState({
      values: { ...this.state.values, [target.name]: target.value },
    });
  };
  handleNext = (e) => {
    let errors = {
      ...this.validateTitle(),
      ...this.validateSeed(),
      ...this.validateTerms(),
    };

    this.setState({ errors }, () => {
      if (Object.keys(errors).length > 0) {
        return;
      }

      this.setState({ storySet: true });
    });
  };
  handleSubmit = () => {
    let story = {
      title: this.state.values.title,
      author: { id: this.user.id, displayName: this.user.displayName },
      seed: this.state.values.seed,
      fragment: this.state.values.fragment,
      createdDate: new Date().getTime(),
    };
    let errors = this.validateFragment();

    this.setState({ errors }, () => {
      if (Object.keys(errors).length > 0) {
        return;
      }
      api
        .post(API_URL + "/story", story)
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
    });
  };
  validateSeed = () => {
    let seed = this.state.values.seed;

    if (seed.length < 50 || seed.length > 1000) {
      return {
        seed: {
          content: "Seed must be between 50 and 1000 characters",
        },
      };
    }
    return {};
  };
  validateTerms = () => {
    let terms = this.state.values.terms;

    if (!terms) {
      return {
        terms: {
          content: "You must agree to the terms of service",
        },
      };
    }
    return {};
  };
  validateTitle = () => {
    let title = this.state.values.title;

    if (title.length < 5 || title.length > 100) {
      return {
        title: {
          content: "Title must be between 5 and 100 characters",
        },
      };
    }
    return {};
  };
  validateFragment = () => {
    let fragment = this.state.values.fragment;

    if (fragment.length < 50 || fragment.length > 1000) {
      return {
        fragment: {
          content: "Fragment must be between 50 and 1000 characters",
        },
      };
    }
    return {};
  };

  renderFragmentForm() {
    return (
      <Card.Content>
        <Form noValidate>
          <Form.Field
            required
            control={TextArea}
            key="fragment"
            label="Fragment"
            name="fragment"
            error={this.state.errors.fragment}
            style={{ minHeight: 100 }}
            value={this.state.values.fragment}
            onChange={(e) => this.handleChange(e.target)}
            placeholder="As the creator, you get to add the first fragment as well, this will help to point your story in the direction you want"
          />
          <Button type="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
          <Button onClick={() => this.setState({ storySet: false })}>
            back
          </Button>
        </Form>
      </Card.Content>
    );
  }
  renderStoryForm() {
    return (
      <Card.Content>
        <Form noValidate>
          <Form.Field
            label="Title"
            control={Input}
            required
            name="title"
            maxLength="100"
            required
            minLength="5"
            name="title"
            value={this.state.values.title}
            onChange={(e) => this.handleChange(e.target)}
            placeholder="Setting a good title can help direct the path the story takes"
            error={this.state.errors.title}
          />
          <Form.Field
            control={Input}
            label="Seed"
            required
            error={this.state.errors.seed}
            maxLength="1000"
            required
            minLength="50"
            name="seed"
            value={this.state.values.seed}
            onChange={(e) => this.handleChange(e.target)}
            placeholder="What are the opening few lines of the story?"
          />
          <Form.Field
            className={styles.flexRowLeft}
            control={(props) => (
              <React.Fragment>
                <Checkbox {...props} />
                <p className={styles.checkboxLabel}>You must agree to the</p>
                <a className="" href="/terms" target="blank">
                  Terms of Service
                </a>
              </React.Fragment>
            )}
            required
            name="terms"
            checked={this.state.values.terms}
            onChange={(e) =>
              this.handleChange({
                name: "terms",
                value: !this.state.values.terms,
              })
            }
          ></Form.Field>
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
            state: { from: "story/new" },
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
