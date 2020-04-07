import React from "react";
import { connect } from "react-redux";
import { appLoaded } from "@store/actions/stories";
import { stories } from "@store/selectors";
import StoryCard from "@components/story/Components/StoryCard";
import NewStoryButton from "@components/home/whatsNew/NewStoryButton";
import Loader from "@components/global/Loader";
import { Container, Card } from "semantic-ui-react";

class WhatsNewView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stories: [], activeTeaser: undefined };
  }
  componentDidMount() {
    console.log("component mounted");
    this.props.appLoaded();
  }
  handleAccoridanClick = (id) => {
    let activeTeaser;
    if (id !== this.state.activeTeaser) {
      activeTeaser = id;
    }
    this.setState({ activeTeaser });
  };
  render() {
    const { activeTeaser } = this.state;
    const { loading, data } = this.props.stories || {};

    if (loading) {
      return <Loader />;
    }

    return (
      <Container text>
        <Card.Group>
          {console.log(this.props.stories)}
          {data && data.length > 0
            ? data.map((story) => {
                let active = activeTeaser === story.id;

                return (
                  <StoryCard
                    key={story.id}
                    story={story}
                    active={active}
                    onExpand={() => this.handleAccoridanClick(story.id)}
                  />
                );
              })
            : null}
          <NewStoryButton />
        </Card.Group>
      </Container>
    );
  }
}

export default connect(stories, { appLoaded })(WhatsNewView);
