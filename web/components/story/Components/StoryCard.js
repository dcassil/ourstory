import React from "react";
import { Card, Feed, Icon, Accordion, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReportAbuse from "./ReportAbuse";
import styles from "../Story.css";

export default function StoryCard({ story, active, onExpand }) {
  return (
    <Card fluid className={styles.storyCard}>
      <Card.Content>
        <Card.Header>
          <Link to={`/story/${story.id}`}>{story.title}</Link>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Accordion>
          <Accordion.Title onClick={onExpand} active={active}>
            <p className="indent">{story.seed}</p>
            {active ? <Icon name="angle up" /> : <Icon name="angle down" />}
          </Accordion.Title>
          <Accordion.Content active={active}>
            {story.teaser} <Link to={`/story/${story.id}`}>read more</Link>
            <Segment basic>
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
                    <ReportAbuse
                      storyId={story.id}
                      fragmentId={story.lastContent.topFragment.id}
                    />
                  </Feed.Meta>
                </Feed.Content>
              ) : null}
            </Segment>
          </Accordion.Content>
        </Accordion>
      </Card.Content>
    </Card>
  );
}
