"use strict";

const dbService = require("../services/db");

function saveNewContentAndFragment(storyId, position, author, fragment) {
  let createdDate = new Date().getTime();
  let content = { storyId, position, createdDate, numberOfFragments: "1" };

  return saveNewStoryContent(content) // save storyContent
    .then((savedContent) => {
      let fragmentData = {
        fragment,
        author,
        storyContentId: savedContent.id,
        upVotes: [],
        downVotes: [],
        createdDate,
      };

      return dbService
        .get()
        .post("storyContentFragment", fragmentData)
        .then((savedFragment) =>
          patchStoryContent(savedContent.id, savedFragment).then(
            (patchedContent) => {
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

function evaluateContentVotes(id, fragmentId, voteType) {
  return dbService
    .get()
    .get("storyContent", { id })
    .then((content) => {
      if (content.topFragment.id === fragmentId && voteType === "up") {
        return;
      }
      return dbService
        .get()
        .search("storyContentFragment", { storyContentId: id })
        .then((fragments) => {
          let sorted = sortByVotes(fragments);
          let topFragment = sorted[0];

          if (content.topFragment.id === topFragment.id) {
            return;
          }

          return dbService
            .get()
            .patch("storyContent", { id: content.id }, { topFragment })
            .then((content) => {
              dbService
                .get()
                .patch("story", { id: content.storyId }, { topFragment });
            });
        });
    });
}

function sortByVotes(data) {
  return data.sort(
    (a, b) =>
      a.upVotes.length - a.downVotes.length <
      b.upVotes.length - b.downVotes.length
  );
}

function getTeaser(id) {
  dbService
    .get()
    .search("storyContent", { storyId: id })
    .then((results) => {
      let teaser = "";

      results.forEach((content) => {
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
    .then((content) => {
      let updateData = {
        lastFragment: fragment,
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
    createdDate,
    upVotes: [],
    downVotes: [],
  };
}

function getFragmentDataFromBody(body) {
  const { author, frament, createdDate } = body;
  return {
    author,
    frament,
    createdDate,
  };
}

module.exports = {
  saveNewContentAndFragment,
  getStoryDataFromBody,
  getFragmentDataFromBody,
  evaluateContentVotes,
  sortByVotes,
};
