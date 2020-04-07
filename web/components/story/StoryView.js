import React from "react";
import { connect } from "react-redux";
import api from "@services/api";
import Authenticator from "../Authenticator";
import FragmentModal from "./Components/FragmentsModal";
import styles from "./Story.css";
import FragmentsModalControler from "./Components/FragmentsModalControler";
import FragmentEditModalControler from "./Components/FragmentEditModalControler";
import ContentEditModalControler from "./Components/ContentEditModalControler";
import Likes from "@components/story/Components/UpVote";
import Dislikes from "@components/story/Components/DownVote";
import { storySelected } from "@store/actions/stories";
import { stories } from "@store/selectors";
import {
  Link,
  Redirect,
  useRouteMatch,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import {
  Header,
  Container,
  Icon,
  Dimmer,
  Loader,
  Feed,
  Card,
  Label,
  Dropdown,
  Grid,
  Checkbox,
} from "semantic-ui-react";

class StoryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, fragments: [], showMeta: false };
    this.id = props.match.params.id;
  }
  componentDidMount() {
    this.fetch();
  }
  fetch() {
    this.props.storySelected(this.id);
  }
  shouldRefetch = () => {
    this.fetch();
  };

  // loadModalDataAndOpen = p => {
  //   console.log("modal props", p);
  //   if (this.state.loading || this.state.isModalOpen) {
  //     return null;
  //   }
  //   api
  //     .get(`${API_URL}/story/${storyId}/content/${id}/fragments`)
  //     .then(response => {
  //       console.log(response);
  //       this.setState({ fragments: response.data, loading: false });
  //     })
  //     .catch(error => {
  //       this.setState({
  //         failMessage: error.response ? error.response.data : error.message
  //       });
  //     });
  //   this.setState({ isModalOpen: true, loading: true });
  // };
  // closeModal = () => {
  //   this.setState({ isModalOpen: false });
  // };
  renderFragment = (data) => {
    let author = data.topFragment.author;
    let text = data.topFragment.fragment;
    let createdDate = data.topFragment.createdDate;
    let upVotes = data.topFragment.upVotes.length;
    let downVotes = data.topFragment.downVotes.length;
    return (
      <div key={data.id} className={styles.flexRow}>
        {this.renderContent(data.topFragment)}
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
    this.setState((prevState) => ({ showMeta: !prevState.showMeta }));
  renderContent({
    author,
    createdDate,
    seed,
    fragment,
    id,
    storyId,
    upVotes,
    downVotes,
  }) {
    let isStorySeed = storyId === undefined;

    return (
      <Feed.Event>
        <Feed.Content>
          {this.state.showMeta ? (
            <Feed.Summary>
              <Feed.User>{author.displayName}</Feed.User>
              <Feed.Date>
                {new Date(createdDate).toLocaleDateString()}
              </Feed.Date>
            </Feed.Summary>
          ) : null}
          <Feed.Extra text>
            <p>{seed || fragment}</p>
          </Feed.Extra>
          {this.state.showMeta && !isStorySeed ? (
            <Feed.Meta className="os-flex">
              <Likes count={upVotes.length} storyId={this.id} contentId={id} />
              <Dislikes
                count={downVotes.length}
                storyId={this.id}
                contentId={id}
              />
            </Feed.Meta>
          ) : null}
        </Feed.Content>
      </Feed.Event>
    );
  }

  log(props) {
    console.log("log", props);
  }
  render() {
    const { loading, selected, error } = this.props.stories || {};
    console.log(this.props);
    // console.log(match);
    if (loading) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    if (error) {
      return <div>{error.message}</div>;
    }
    if (!selected) {
      return <div>No Story Found</div>;
    }

    return (
      <Container text>
        <Card fluid className={styles.storyCard}>
          <Card.Content>
            <Switch>
              <Route exact path={`${this.props.match.path}/content/new`}>
                {(props) => (
                  <ContentEditModalControler
                    {...props}
                    shouldRefetch={this.shouldRefetch}
                  />
                )}
              </Route>
              <Route
                exact
                path={`${this.props.match.path}/content/:contentId/fragments`}
              >
                {(props) => (
                  <FragmentsModalControler
                    {...props}
                    shouldRefetch={this.shouldRefetch}
                  />
                )}
              </Route>
              <Route
                exact
                path={`${this.props.match.path}/content/:contentId/fragments/new`}
              >
                {(props) => (
                  <FragmentEditModalControler
                    {...props}
                    shouldRefetch={this.shouldRefetch}
                  />
                )}
              </Route>
            </Switch>
            <Container className={styles.flexRow}>
              <Header as="h2">{selected.title}</Header>
              <Likes count={selected.upVotes.length} storyId={this.id} />
              <Dislikes count={selected.downVotes.length} storyId={this.id} />
              <Checkbox
                toggle
                label="Show Details"
                onChange={this.toggleMeta}
                checked={this.state.showMeta}
              ></Checkbox>
            </Container>

            <Container>
              {this.renderContent(this.props.stories.selected || {})}
              {selected.content.map((c) => this.renderFragment(c))}
            </Container>
            <Link to={`/story/${selected.id}/content/new`}>
              Add to this story
            </Link>
          </Card.Content>
        </Card>
      </Container>
    );
  }
}

export default connect(stories, { storySelected })(StoryView);
