import React from "react";
import styles from "./Story.css";
import { Link, Route } from "react-router-dom";
import { Feed } from "semantic-ui-react";
import Likes from "@components/story/Components/UpVote";
import Dislikes from "@components/story/Components/DownVote";

export default function renderContent({
  author,
  createdDate,
  seed,
  fragment,
  id,
  storyId,
  upVotes,
  downVotes,
  showMeta,
  onChange,
}) {
  let isStorySeed = storyId === undefined;

  return (
    <Feed.Event>
      <Feed.Content>
        {showMeta ? (
          <Feed.Summary>
            <Feed.User>{author.displayName}</Feed.User>
            <Feed.Date>{new Date(createdDate).toLocaleDateString()}</Feed.Date>
          </Feed.Summary>
        ) : null}
        <Feed.Extra text>
          <p>{seed || fragment}</p>
        </Feed.Extra>
        {showMeta && !isStorySeed ? (
          <Feed.Meta className="os-flex">
            <Likes
              count={upVotes.length}
              storyId={storyId}
              contentId={id}
              onChange={onChange}
            />
            <Dislikes
              count={downVotes.length}
              storyId={storyId}
              contentId={id}
              onChange={onChange}
            />
          </Feed.Meta>
        ) : null}
      </Feed.Content>
    </Feed.Event>
  );
}
