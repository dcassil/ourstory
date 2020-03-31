"use strict";

const dbService = require("../services/db");

function saveNewContentAndFragment(storyId, position, author, fragment) {
  let createdDate = new Date().getTime();
  let content = { storyId, position, createdDate, numberOfFragments: 1 };

  return saveNewStoryContent(content) // save storyContent
    .then(savedContent => {
      let fragmentData = {
        fragment,
        author,
        storyContentId: savedContent.id,
        upVotes: 0,
        downVotes: 0,
        createdDate
      };

      return dbService
        .get()
        .post("storyContentFragment", fragmentData)
        .then(savedFragment =>
          patchStoryContent(savedContent.id, savedFragment).then(
            patchedContent => {
              let teaser = getTeaser(storyId);

              return dbService.get().patch(
                // update storyContent with fragment details.
                "story",
                { id: storyId },
                { teaser, lastContent: { ...savedContent, ...patchedContent } }
              );
            }
          )
        );
    });
}

function getTeaser(id) {
  dbService
    .get()
    .search("storyContent", { storyId: id })
    .then(results => {
      let teaser = "";

      results.forEach(content => {
        if (teaser.length < 500) {
          teaser += ` ${content.topFragment.fragment}`;
        }
      });
      dbService.get().patch(
        // update storyContent with fragment details.
        "story",
        { id: id },
        { teaser }
      );
    });
}

function patchStoryContent(id, fragment) {
  return dbService
    .get()
    .get("storyContent", { id })
    .then(content => {
      let updateData = {
        lastFragment: fragment
      };

      if (
        !content.topFragment ||
        fragment.upVotes > content.topFragment.upVotes
      ) {
        updateData.topFragment = fragment;
      }

      return dbService.get().patch(
        // update storyContent with fragment details.
        "storyContent",
        { id: id },
        updateData
      );
    });
}

function saveNewStoryContent(storyContent) {
  return dbService.get().post("storyContent", storyContent);
}

function getStoryDataFromBody(body) {
  const { title, author, seed, createdDate } = body;
  return {
    title,
    author,
    authors: [author],
    seed,
    createdDate
  };
}

function getFragmentDataFromBody(body) {
  const { author, frament, createdDate } = body;
  return {
    author,
    frament,
    createdDate
  };
}

module.exports = {
  saveNewContentAndFragment,
  getStoryDataFromBody,
  getFragmentDataFromBody
};
