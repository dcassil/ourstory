import React from "react";
import axios from "axios";
import Authenticator from "../Authenticator";

import { Link, Redirect } from "react-router-dom";
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
    this.state = { loading: true };
    this.id = props.match.params.id;
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
  renderFragment = data => {
    return (
      <Grid>
        <Grid.Row columns={10}>
          <Grid.Column width={10}>
            <Feed.Event key={data.id}>
              <Feed.Content>
                {this.state.showDetails ? (
                  <Feed.Summary>
                    <Feed.User>{data.topFragment.author.displayName}</Feed.User>
                    <Feed.Date>
                      {new Date(
                        data.topFragment.createdDate
                      ).toLocaleDateString()}
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
          </Grid.Column>
          <Grid.Column width={1}>
            <Dropdown icon="bars" floating labeled>
              <Dropdown.Menu inverted>
                <Dropdown.Header content="something" />
                <Dropdown.Item name="inbox" onClick={this.handleItemClick}>
                  See Alternates
                  <Label color="teal">{data.numberOfFragments || 0}</Label>
                </Dropdown.Item>

                <Dropdown.Item name="spam" onClick={this.handleItemClick}>
                  Add Alternate
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
        <Header as="h2">{this.state.story.title}</Header>
        <Feed></Feed>
        {this.state.story.content.map(c => this.renderFragment(c))}
        <Link to="/story/content/new">Add to this story</Link>
      </Container>
    );
  }
}
