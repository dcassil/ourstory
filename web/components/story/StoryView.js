import React from "react";
import { connect } from "react-redux";
import api from "@services/api";
import PrivateRoute from "@components/PrivateRoute";
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
import { Link, Switch, Route } from "react-router-dom";
import StoryViewFragment from "./StoryViewFragment";
import StoryViewContent from "./StoryViewContent";
import NewStoryButton from "@components/story/Components/PrimaryButton";
import {
  Header,
  Container,
  Dimmer,
  Loader,
  Card,
  Checkbox,
} from "semantic-ui-react";

class StoryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, fragments: [], showMeta: false };
    this.id = props.match.params.id;
    this.isLoggedIn = Authenticator.isLoggedIn();
  }
  componentDidMount() {
    this.fetch();
  }
  fetch = () => {
    this.props.storySelected(this.id);
  };
  toggleMeta = () =>
    this.setState((prevState) => ({ showMeta: !prevState.showMeta }));

  log(props) {
    console.log("log", props);
  }
  render() {
    const { loading, selected, error } = this.props.stories || {};
    console.log(this.props);
    // console.log(match);
    if (loading || !selected) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    if (error) {
      return <div>{error.message}</div>;
    }

    return (
      <Container text className="stretch">
        <Card fluid className={styles.storyCard}>
          <Card.Header>
            <Link to="/">back</Link>
          </Card.Header>
          <Card.Content>
            <Switch>
              <PrivateRoute exact path={`${this.props.match.path}/content/new`}>
                {(props) => (
                  <ContentEditModalControler
                    {...props}
                    shouldRefetch={this.fetch}
                  />
                )}
              </PrivateRoute>
              <Route
                exact
                path={`${this.props.match.path}/content/:contentId/fragments`}
              >
                {(props) => (
                  <FragmentsModalControler
                    {...props}
                    beforeClose={this.fetch}
                  />
                )}
              </Route>
              <PrivateRoute
                exact
                path={`${this.props.match.path}/content/:contentId/fragments/new`}
              >
                {(props) => (
                  <FragmentEditModalControler
                    {...props}
                    shouldRefetch={this.fetch}
                  />
                )}
              </PrivateRoute>
            </Switch>
            <Container className={styles.flexRow}>
              <Header as="h2">{selected.title}</Header>
              <Likes
                count={selected.upVotes.length}
                storyId={this.id}
                onChange={this.fetch}
              />
              <Dislikes
                count={selected.downVotes.length}
                storyId={this.id}
                onChange={this.fetch}
              />
              <Checkbox
                toggle
                label="Show Details"
                onChange={this.toggleMeta}
                checked={this.state.showMeta}
              ></Checkbox>
            </Container>
            <Container>
              <StoryViewContent
                showMeta={this.state.showMeta}
                onChange={this.fetch}
                storyId={this.id}
                {...(this.props.stories.selected || {})}
              />
              {selected.content.map((c) => (
                <StoryViewFragment
                  key={c.id}
                  showMeta={this.state.showMeta}
                  onChange={this.fetch}
                  isLoggedIn={this.isLoggedIn}
                  {...this.props}
                  {...c}
                />
              ))}
            </Container>{" "}
            {this.isLoggedIn ? (
              <NewStoryButton
                path={`/story/${selected.id}/content/new`}
                label="Add to this story"
              />
            ) : null}
          </Card.Content>
        </Card>
      </Container>
    );
  }
}

export default connect(stories, { storySelected })(StoryView);
