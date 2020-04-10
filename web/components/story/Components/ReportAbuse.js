import React, { useState } from "react";
import api from "@services/api";
import { Feed, Icon } from "semantic-ui-react";

export default function ReportAbuse({ storyId, fragmentId }) {
  return (
    <Feed.Like
      className="os-flexFill os-textRight os-red"
      onClick={() => report(storyId, fragmentId)}
    >
      <Icon name="spy" />
      Report abuse
    </Feed.Like>
  );
}

function report(storyId, fragmentId) {
  let confirm = true;

  if (!fragmentId) {
    confirm = window.confirm(
      "If you are reporting due to the content of a story, please make sure you have clicked report on the individual content piece, and not the entire story.  If you are reporting due to the title, the first part of the story, tags, rating, or genere, please continue"
    );
  }

  let details = window.prompt(
    "We have logged the details needed to investigate this report, however please provide any information you think will help us"
  );

  if (confirm) {
    return api
      .post(`${API_URL}/report/abuse`, {
        storyId,
        fragmentId,
        details,
      })
      .catch(console.warn);
  }
}
