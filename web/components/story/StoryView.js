import React from "react";
import axios from "axios";
import Authenticator from "../Authenticator";
import FragmentModal from "./Components/FragmentsModal";
import styles from "./Story.css";

import { Link, Redirect } from "react-router-dom";
import * as rrrr from "react-router-dom";
import {
  Header,
  Container,
  Icon,
  Dimmer,
  Loader,
  Feed,
  Popup,
  Label,
  Dropdown,
  Grid
} from "semantic-ui-react";

export default class WhatsNewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, fragments: [] };
    this.id = props.match.params.id;
    console.log(rrrr);
  }
  componentDidMount() {
    axios
      .get(`${API_URL}/story/${this.id * 1}`)
      .then(response => {
        console.log(response);
        this.setState({ story: response.data, loading: false });
      })
      .catch(error => {
        this.setState({
          failMessage: error.response ? error.response.data : error.message
        });
      });
  }
  loadModalDataAndOpen = (storyId, id) => {
    axios
      .get(`${API_URL}/story/${storyId * 1}/content/${id * 1}/fragments`)
      .then(response => {
        console.log(response);
        this.setState({ fragments: response.data, loading: false });
      })
      .catch(error => {
        this.setState({
          failMessage: error.response ? error.response.data : error.message
        });
      });
    this.setState({ isModalOpen: true, loading: true });
  };
  closeModal = () => {
    this.setState({ isModalOpen: false });
  };
  renderFragment = data => {
    console.log("styles", styles);
    return (
      <div key={data.id} className={styles.flexRow}>
        <Feed.Event>
          <Feed.Content>
            {this.state.showDetails ? (
              <Feed.Summary>
                <Feed.User>{data.topFragment.author.displayName}</Feed.User>
                <Feed.Date>
                  {new Date(data.topFragment.createdDate).toLocaleDateString()}
                </Feed.Date>
              </Feed.Summary>
            ) : null}
            <Feed.Extra text>
              <p>{data.topFragment.fragment}</p>
            </Feed.Extra>
            <Feed.Meta className="os-flex">
              <Feed.Like>
                <Icon name="thumbs up" />
                {data.topFragment.upVotes.length} Likes
              </Feed.Like>
              <Feed.Like>
                <Icon name="thumbs down" />
                {data.topFragment.downVotes.length} dislike
              </Feed.Like>
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>
        <Dropdown icon="bars">
          <Dropdown.Menu>
            <Dropdown.Header content="something" />
            <Dropdown.Item
              name="inbox"
              onClick={() => {
                this.loadModalDataAndOpen(data.storyId, data.id);
              }}
            >
              See Alternates
              <Label className={styles.rightHandLabel} color="teal">
                {data.numberOfFragments || 0}
              </Label>
            </Dropdown.Item>

            <Dropdown.Item name="spam" onClick={this.handleItemClick}>
              <Link
                to={`/story/${this.state.story.id}#/content/${data.id}/fragment/new`}
              >
                Add Alternates
              </Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };
  render() {
    if (this.state.loading) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    if (this.state.failMessage) {
      return <div>{error.message}</div>;
    }
    if (!this.state.story) {
      return <div>No Story Found</div>;
    }

    return (
      <Container text>
        <FragmentModal
          open={this.state.isModalOpen}
          fragments={this.state.fragments}
          closeCallback={this.closeModal}
        />
        <Header as="h2">{this.state.story.title}</Header>
        <Container>
          {this.state.story.content.map(c => this.renderFragment(c))}
        </Container>
        <Link to={`/story/${this.state.story.id}/content/new`}>
          Add to this story
        </Link>
      </Container>
    );
  }
}
