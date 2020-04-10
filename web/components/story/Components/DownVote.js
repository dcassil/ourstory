import React, { useState } from "react";
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
      onClick={() =>
        postVote(storyId, contentId, fragmentId).then(() => {
          if (typeof onChange === "function") {
            onChange();
          }
        })
      }
    >
      <Icon size="small" name="thumbs down" />
      {count}
    </Feed.Like>
  );
}

function postVote(storyId, contentId, fragmentId) {
  if (storyId) {
    return api
      .post(`${API_URL}/story/${storyId}/downvote`, { id: storyId })
      .catch(console.warn);
  }
  return api
    .post(`${API_URL}/fragments/${fragmentId}/downvote`, {
      id: fragmentId,
      contentId,
    })
    .catch(console.warn);
}
