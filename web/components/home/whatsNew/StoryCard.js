import React from "react";
import { Card, Feed, Icon, Accordion } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function StoryCard({ story, active, onExpand }) {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{story.title}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Accordion>
          <Accordion.Title onClick={onExpand} active={active}>
            {story.seed}{" "}
            {active ? <Icon name="angle up" /> : <Icon name="angle down" />}
          </Accordion.Title>
          <Accordion.Content active={active}>
            {story.teaser} <Link to={`/story/${story.id}`}>read more</Link>
          </Accordion.Content>
        </Accordion>
      </Card.Content>
      <Card.Content>
        <Feed>
          <Feed.Event>
            <Feed.Label></Feed.Label>
            {story.lastContent ? (
              <Feed.Content>
                <Feed.Date></Feed.Date>
                <Feed.Summary>
                  <Feed.Extra text>Latest Addition</Feed.Extra>
                  <Feed.User>
                    {story.lastContent.topFragment.author.displayName}
                  </Feed.User>
                  <Feed.Date>
                    {new Date(
                      story.lastContent.topFragment.createdDate
                    ).toLocaleDateString()}
                  </Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>
                  {story.lastContent.topFragment.fragment}
                </Feed.Extra>
                <Feed.Meta className="os-flex">
                  <Feed.Like>
                    <Icon name="thumbs up" />
                    {story.lastContent.topFragment.upVotes.length} Likes
                  </Feed.Like>
                  <Feed.Like>
                    <Icon name="thumbs down" />
                    {story.lastContent.topFragment.downVotes.length} dislike
                  </Feed.Like>

                  <Feed.Like className="os-flexFill os-textRight os-red">
                    <Icon name="spy" />
                    Report abuse
                  </Feed.Like>
                </Feed.Meta>
              </Feed.Content>
            ) : null}
          </Feed.Event>
        </Feed>
      </Card.Content>
    </Card>
  );
}
