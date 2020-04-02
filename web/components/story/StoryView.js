import React from "react";
import axios from "axios";
import Authenticator from "../Authenticator";
import FragmentModal from "./Components/FragmentsModal";
import styles from "./Story.css";
import FragmentsModalControler from "./Components/FragmentsModalControler";
import FragmentEditModalControler from "./Components/FragmentEditModalControler";
import ContentEditModalControler from "./Components/ContentEditModalControler";

import {
  Link,
  Redirect,
  useRouteMatch,
  Switch,
  Route,
  useParams
} from "react-router-dom";

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
  Grid,
  Checkbox
} from "semantic-ui-react";

export default class WhatsNewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, fragments: [], showMeta: false };
    this.id = props.match.params.id;
  }
  componentDidMount() {
    axios
      .get(`${API_URL}/story/${this.id}`)
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
  loadModalDataAndOpen = p => {
    console.log("modal props", p);
    if (this.state.loading || this.state.isModalOpen) {
      return null;
    }
    axios
      .get(`${API_URL}/story/${storyId}/content/${id}/fragments`)
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
    return (
      <div key={data.id} className={styles.flexRow}>
        <Feed.Event>
          <Feed.Content>
            {this.state.showMeta ? (
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
            {this.state.showMeta ? (
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
            ) : null}
          </Feed.Content>
        </Feed.Event>
        <Dropdown icon="bars">
          <Dropdown.Menu>
            <Dropdown.Header content="something" />
            <Dropdown.Item
              name="inbox"
              onClick={() => {
                this.props.history.push(
                  `${this.props.match.url}/content/${data.id}/fragments`
                );
              }}
            >
              See Alternates
              <Label className={styles.rightHandLabel} color="teal">
                {data.totalFragments ? data.totalFragments + 1 : 1}
              </Label>
            </Dropdown.Item>

            <Dropdown.Item name="spam" onClick={this.handleItemClick}>
              <Link
                to={`${this.props.match.url}/content/${data.id}/fragments/new`}
              >
                Add Alternates
              </Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };
  toggleMeta = () =>
    this.setState(prevState => ({ showMeta: !prevState.showMeta }));
  log(props) {
    console.log("log", props);
  }
  render() {
    console.log(this.props);
    // console.log(match);
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
        <Switch>
          <Route exact path={`${this.props.match.path}/content/new`}>
            {props => <ContentEditModalControler {...props} />}
          </Route>
          <Route
            exact
            path={`${this.props.match.path}/content/:contentId/fragments`}
          >
            {props => <FragmentsModalControler {...props} />}
          </Route>
          <Route
            exact
            path={`${this.props.match.path}/content/:contentId/fragments/new`}
          >
            {props => <FragmentEditModalControler {...props} />}
          </Route>
        </Switch>
        <FragmentModal
          open={this.state.isModalOpen}
          fragments={this.state.fragments}
          closeCallback={this.closeModal}
        />
        <Container className={styles.flexRow}>
          <Header as="h2">{this.state.story.title}</Header>
          <Checkbox
            toggle
            label="Show Details"
            onChange={this.toggleMeta}
            checked={this.state.showMeta}
          ></Checkbox>
        </Container>

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
