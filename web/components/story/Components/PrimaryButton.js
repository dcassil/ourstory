import React from "react";
import { Card, Feed, Icon, Accordion } from "semantic-ui-react";
import { Link } from "react-router-dom";
import styles from "@components/story/Story.css";

export default function NewStoryButton({ path, label }) {
  return (
    <Card fluid className={styles.storyCard}>
      <Card.Content>
        <Card.Header textAlign="center">
          <Link to={path}>{label}</Link>
        </Card.Header>
      </Card.Content>
    </Card>
  );
}
