import React from "react";
import api from "@services/api";
import { Feed, Icon } from "semantic-ui-react";

export default function StoryCard({
  storyId,
  contentId,
  fragmentId,
  count,
  onChange,
}) {
  return (
    <Feed.Like
      onClick={() => postVote(storyId, contentId, fragmentId).then(onChange)}
    >
      <Icon name="thumbs up" />
      {count} Likes
    </Feed.Like>
  );
}

function postVote(storyId, contentId, fragmentId) {
  if (!contentId) {
    return api
      .post(`${API_URL}/story/${storyId}/upvote`, { id: storyId })

      .catch(console.warn);
  }
  return api
    .post(`${API_URL}/fragments/${fragmentId}/upvote`, {
      id: fragmentId,
      contentId,
    })
    .catch(console.warn);
}
