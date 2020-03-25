import React from "react";
import axios from "axios";

export default class WhatsNewView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stories: [] };
  }
  componentDidMount() {
    console.log("component mounted");
    axios.get(API_URL + "/story").then(response => {
      this.setState({ stories: response.data });
    });
  }
  render() {
    console.log("rendering with", this.state);
    if (this.state.stories && this.state.stories.length > 0) {
      console.log("rendering stories");
      return (
        <div>
          {this.state.stories.map(story => (
            <div key={story.id}>title: {story.title}</div>
          ))}
        </div>
      );
    }
    return <div>No stories</div>;
  }
}
