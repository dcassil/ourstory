"use strict";

const dbService = require("../services/db");
const auth = require("../services/auth");
const exception = require("../services/exception");
const router = require("express").Router();
const storyHelpers = require("./storyHelpers");

const requireAuthentication = auth.requireAuthentication;
/**
 * id: <number>
 * storyId: <number>
 * position: <number>
 * topFragment: <StoryContentFragment>
 * lastFragment: <StoryContentFragment>
 * fragments: [StoryContentFragment.id]
 * **/

router.get("/", function (req, res) {
  dbService
    .get()
    .get("storyContent", { id: req.params.id })
    .then((storyContent) => res.json(storyContent))
    .catch((e) => exception.general(e, res));
});

router.get("/:contentId/fragments", function (req, res) {
  dbService
    .get()
    .search("storyContentFragment", {
      storyContentId: req.params.contentId,
    })
    .then((fragments) => res.json(storyHelpers.sortByVotes(fragments)))
    .catch((e) => exception.general(e, res));
});

router.post("/:contentId/fragments", requireAuthentication);
router.post("/:contentId/fragments", function (req, res) {
  let fragment = req.body;

  dbService
    .get()
    .get("storyContent", { id: req.params.contentId })
    .then((storyContent) => {
      if (!storyContent) {
        let message = "We could not find the storyContent";

        exception.log(message);
        res.status(404).send(message);
      }

      if (
        !auth.isAdmin(req) &&
        storyContent.lastFragment &&
        storyContent.lastFragment.author.id === req.user.id
      ) {
        let message =
          "You can not wrtie two fragments, back to back, on the same story";

        exception.log(message);
        res.status(403).send(message);
      }

      dbService
        .get()
        .post("storyContentFragment", {
          // save fragment
          author: fragment.author,
          fragment: fragment.fragment,
          storyContentId: storyContent.id,
          upVotes: [],
          downVotes: [],
          lastModified: new Date().getTime(),
          createdDate: new Date().getTime(),
        })
        .then((savedFragment) =>
          dbService
            .get()
            .search("storyContentFragment", { storyContentId: storyContent.id })
            .then((fragments) =>
              dbService
                .get()
                .patch(
                  "storyContent",
                  { id: storyContent.id },
                  {
                    lastFragment: savedFragment,
                    totalFragments: fragments.length,
                  }
                )
                .then((response) => {
                  res.sendStatus(200);
                })
            )
        );
    })
    .catch((e) => exception.general(e, res));
});

router.patch("/", requireAuthentication);
router.patch("/", function (req, res) {
  dbService
    .get()
    .get("storyContent", { id: req.body.id })
    .then((story) => {
      getStoryAuth(req, story);

      return dbService
        .get()
        .patch(
          "storyContent",
          { id: req.body.id },
          {
            title: req.body.title,
            seed: req.body.seed,
            lastModified: new Date().getTime(),
          }
        )
        .then(() => res.sendStatus(200));
    });
});

router.delete("/", requireAuthentication);
router.delete("/:id", function (req, res) {
  dbService
    .get()
    .get("storyContent", { id: req.params.id })
    .then((story) => {
      getStoryAuth(req, story);
      return story.delete().then(() => res.sendStatus(200));
    })
    .catch((error) => res.status(500).send(error));

  // .delete("accounts", { username: req.params.id })
  // .then(() => res.sendStatus(200))
  // .catch(error => res.status(500).send(error));
});

let getStoryAuth = (req, story) => {
  let storyAuthData = {
    exists: story !== undefined,
    isAuthor: story.author === req.user.id,
    isDeletable: story.fragments.length > 1,
  };

  if (!storyAuthData.exists) {
    res.status(404).send(new Error("No story found for the id provided"));
  }

  if (!storyAuthData.isAuthor) {
    res
      .status(401)
      .send(
        new Error(
          "Only the story owner or system admin can edit or delete this story"
        )
      );
  }

  if (!storyAuthData.isDeletable) {
    res
      .status(403)
      .send(
        new Error(
          "Once a story has been contributed to, by another member, it can not be edited or deleted."
        )
      );
  }

  return storyAuthData;
};

module.exports = router;

// module.exports = {
//   post
// };
