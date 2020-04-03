import React from "react";
import { Card, Feed, Icon, Accordion } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function NewStoryButton({ story, active }) {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header textAlign="center">
          <Link to="/story/new">Create A New Story</Link>
        </Card.Header>
      </Card.Content>
    </Card>
  );
}
