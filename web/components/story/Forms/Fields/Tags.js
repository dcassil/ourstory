import React, { Component } from "react";
import { connect } from "react-redux";
import api from "@services/api";
import { tagsNeeded } from "@store/actions/tags";
import { tags } from "@store/selectors";
import { Search, Form, Header, Segment } from "semantic-ui-react";
import Loader from "@components/global/Loader";
import styles from "./tags.css";

const initialState = {
  isLoading: false,
  results: [],
  value: "",
  addedTags: [],
};

class Tags extends Component {
  state = initialState;
  componentDidMount() {
    this.props.tagsNeeded();
  }

  handleResultSelect = (e, { result }) => {
    this.state.addedTags.push(result.value);

    this.setState(
      {
        value: "",
        results: [],
        addedTags: this.state.addedTags,
      },
      this.props.onChange({ name: "tags", value: this.state.addedTags })
    );
  };

  handleRemoveTagClick = (index) => {
    this.state.addedTags.splice(index, 1);

    this.setState(
      { addedTags: this.state.addedTags },
      this.props.onChange({ name: "tags", value: this.state.addedTags })
    );
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    let timeout = setTimeout(() => {
      clearTimeout(timeout);

      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.title);
      let results = this.props.tags.data
        .map((tag) => ({ title: tag, value: tag }))
        .filter((tag) => {
          return isMatch(tag) && !this.state.addedTags.includes(tag.value);
        });

      if (results.length === 0) {
        results = [{ title: value, value }];
      }

      this.setState({
        isLoading: false,
        results,
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;
    let { tags, ...props } = this.props;

    if (!tags || tags.loading) {
      return <Loader />;
    }

    return (
      <Form.Group>
        <Form.Field name="tags">
          <label>Tags</label>
          <Search
            name="tags"
            showNoResults={false}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onKeyPress={(event) => {
              if (event.target.name === "tags" && event.key === "Enter") {
                event.preventDefault();
                this.handleResultSelect(
                  event,
                  {
                    result: { value: event.target.value },
                  },
                  event.target.click
                );
              }
            }}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
          />
        </Form.Field>
        <Form.Field>
          <label>Current Tags</label>
          {this.state.addedTags.map((tag, index) => (
            <p key={index} className={styles.addedTag}>
              {tag}
              <span
                className={styles.removeButton}
                onClick={() => this.handleRemoveTagClick(index)}
              >
                x
              </span>
            </p>
          ))}
        </Form.Field>
      </Form.Group>
    );
  }
}

export default connect(tags, { tagsNeeded })(Tags);
