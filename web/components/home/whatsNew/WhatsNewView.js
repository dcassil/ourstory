import React from "react";
import api from "@services/api";
import StoryCard from "@components/story/Components/StoryCard";
import NewStoryButton from "@components/home/whatsNew/NewStoryButton";
import { Container, Card } from "semantic-ui-react";

export default class WhatsNewView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stories: [], activeTeaser: undefined };
  }
  componentDidMount() {
    console.log("component mounted");
    api.get(API_URL + "/story").then((response) => {
      this.setState({ stories: response.data });
    });
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
    return (
      <Container text>
        <Card.Group>
          {this.state.stories && this.state.stories.length > 0
            ? this.state.stories.map((story) => {
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
