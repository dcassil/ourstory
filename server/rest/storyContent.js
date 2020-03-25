"use strict";

const dbService = require("../services/db");
const auth = require("../services/auth");
const exception = require("../services/exception");
const router = require("express").Router();

const requireAuthentication = auth.requireAuthentication;
/**
 * id: <number>
 * storyId: <number>
 * position: <number>
 * topFragment: <StoryContentFragment>
 * lastFragment: <StoryContentFragment>
 * fragments: [StoryContentFragment.id]
 * **/

router.get("/:id", function(req, res) {
  dbService
    .get()
    .get("storyContent", { id: req.params.id })
    .then(storyContent => res.json(storyContent))
    .catch(e => exception.general(e, res));
});

router.get("/:id/fragments", function(req, res) {
  dbService
    .get()
    .get("storyContentFragment", { storyContentId: req.params.id })
    .then(fragments => res.json(fragments))
    .catch(e => exception.general(e, res));
});

router.post("/", requireAuthentication);
router.post("/", function(req, res) {
  let storyContent = req.body;

  dbService
    .get()
    .get("story", { id: req.body.storyId })
    .then(story => {
      if (!story) {
        let message = "We could not find the story";

        exception.log(message);
        res.status(404).send(message);
      }

      if (
        story.lastFragment &&
        story.lastFragment.author.id === req.body.user.id
      ) {
        let message =
          "You can not wrtie two fragments, back to back, on the same story";

        exception.log(message);
        res.status(403).send(message);
      }

      return saveNewStoryContent(storyContent) // save storyContent
        .then(savedContent =>
          saveNewContentFragment(req, savedContent.id).then(savedFragment =>
            patchStoryContent(savedContent.id, savedFragment).then(result =>
              res.json(result)
            )
          )
        );
    })
    .catch(e => exception.general(e, res));
});

router.patch("/", requireAuthentication);
router.patch("/", function(req, res) {
  dbService
    .get()
    .get("storyContent", { id: req.body.id })
    .then(story => {
      getStoryAuth(req, story);

      return dbService
        .get()
        .patch(
          "storyContent",
          { id: req.body.id },
          {
            title: req.body.title,
            seed: req.body.seed,
            lastModified: new Date().getTime()
          }
        )
        .then(() => res.sendStatus(200));
    });
});

router.delete("/", requireAuthentication);
router.delete("/:id", function(req, res) {
  dbService
    .get()
    .get("storyContent", { id: req.params.id })
    .then(story => {
      getStoryAuth(req, story);
      return story.delete().then(() => res.sendStatus(200));
    })
    .catch(error => res.status(500).send(error));

  // .delete("accounts", { username: req.params.id })
  // .then(() => res.sendStatus(200))
  // .catch(error => res.status(500).send(error));
});

let getStoryAuth = (req, story) => {
  let storyAuthData = {
    exists: story !== undefined,
    isCreator: story.creator === req.user.id,
    isDeletable: story.fragments.length > 1
  };

  if (!storyAuthData.exists) {
    res.status(404).send(new Error("No story found for the id provided"));
  }

  if (!storyAuthData.isCreator) {
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
function patchStoryContent(is, fragment) {
  return dbService.get().patch(
    // update storyContent with fragment details.
    "storyContent",
    { id: id },
    {
      topFragment: fragment,
      lastFragment: fragment
    }
  );
}

function saveNewStoryContent(storyContent) {
  return dbService.get().post("storyContent", storyContent);
}

function saveNewContentFragment(req, storyContentId) {
  return dbService.get().post("storyContentFragment", {
    // save fragment
    author: req.body.user,
    fragment: req.body.fragment,
    storyContentId: storyContentId,
    upVotes: 0,
    downVotes: 0
  });
}
