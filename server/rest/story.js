"use strict";

const dbService = require("../services/db");
const auth = require("../services/auth");
const router = require("express").Router();
const logger = require("../logger")(module);
const exception = require("../services/exception");
const storyHelpers = require("./storyHelpers");
const tagHelpers = require("./tagHelpers");

const requireAuthentication = auth.requireAuthentication;
const validateContentOwner = auth.validateContentOwner;

/**
 * schema
 *
 * title: <String>
 * authors: [{userId: user.id, userName: user.displayName}]
 * author: {id: <user.Id>, name: user.displayName}
 * seed: <String> first sentece of story
 * content: [StoryContent]
 * **/

router.get("/", function (req, res) {
  dbService
    .get()
    .get("story")
    .then((story) => res.json(story));
});

router.get("/:id", function (req, res) {
  let id = req.params.id;

  dbService
    .get()
    .get("story", { id })
    .then((story) =>
      dbService
        .get()
        .search("storyContent", { storyId: id })
        .then((content) => res.json({ ...story, content }))
    )
    .catch((e) => exception.general(e, res));
});

router.get("/:id/content", function (req, res) {
  dbService
    .get()
    .get("storyContent", { storyId: req.params.id })
    .then((storyContent) => res.json(storyContent))
    .catch((e) => exception.general(e, res));
});

router.post("/", requireAuthentication);
router.post("/", function (req, res) {
  let newStory = storyHelpers.getStoryDataFromBody(req.body);

  dbService
    .get()
    .get("story", { title: newStory.title })
    .then((story) => {
      if (story) {
        logger.error("create new story: title existed");
        res.status(400).send("story title existed");
      }
    })
    .catch(() => {
      dbService
        .get()
        .post("story", newStory)
        .then((result) => {
          tagHelpers.updateTagsList(newStory.tags);
          if (req.body.fragment.length === 0) {
            res.json(result);
          }
          storyHelpers
            .saveNewContentAndFragment(
              result.id,
              0,
              req.body.author,
              req.body.fragment
            )
            .then(() => {
              res.json(result);
            });
        })
        .catch((e) => exception.general(e, res));
    });
});

router.post("/:id/content", requireAuthentication);
router.post("/:id/content", function (req, res) {
  let storyContent = req.body;

  dbService
    .get()
    .get("story", { id: req.params.id })
    .then((story) => {
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
        .then((savedContent) =>
          saveNewContentFragment(req, savedContent.id).then((savedFragment) =>
            patchStoryContent(savedContent.id, savedFragment).then((result) =>
              res.json({ ...savedContent, ...result })
            )
          )
        );
    })
    .catch((e) => exception.general(e, res));
});

function saveNewStoryContent(storyContent) {
  return dbService.get().post("storyContent", storyContent);
}

function saveNewContentFragment(req, storyContentId) {
  return dbService.get().post("storyContentFragment", {
    // save fragment
    author: req.body.author,
    fragment: req.body.fragment,
    storyContentId: storyContentId,
    upVotes: [],
    downVotes: [],
    lastModified: new Date().getTime(),
    createdDate: new Date().getTime(),
  });
}

function patchStoryContent(id, fragment) {
  return dbService.get().patch(
    // update storyContent with fragment details.
    "storyContent",
    { id },
    {
      topFragment: fragment,
      lastFragment: fragment,
    }
  );
}

router.post("/:id/upvote", requireAuthentication);
router.post("/:id/upvote", function (req, res) {
  dbService
    .get()
    .get("story", { id: req.body.id })
    .then((story) => {
      dbService
        .get()
        .patch("story", { upVotes: story.upVotes.push(req.user.id) })
        .then((story) => {
          storyHelpers.evaluateContentVotes(
            req.body.contentId,
            req.body.id,
            "up"
          );
          res.json(story);
        });
    });
});

router.post("/:id/downvote", requireAuthentication);
router.post("/:id/downvote", function (req, res) {
  dbService
    .get()
    .get("story", { id: req.body.id })
    .then((story) => {
      if (story.downVotes.includes(req.user.id)) {
        res
          .status(403)
          .send(
            new Error(
              "You may only vote once per story, however you can change down vote to an upvote"
            )
          );
      }
      dbService
        .get()
        .patch("story", { downvotes: story.downVotes.push(req.user.id) })
        .then((story) => {
          storyHelpers.evaluateContentVotes(
            req.body.contentId,
            req.body.id,
            "down"
          );
          res.json(story);
        });
    })
    .catch((error) => res.status(500).send(error));
});

router.patch("/", requireAuthentication);
router.patch("/", function (req, res) {
  dbService
    .get()
    .get("story", { id: req.body.id })
    .then((story) => {
      getStoryAuth(req, story);

      dbService
        .get()
        .patch(
          "story",
          { id: req.body.id },
          {
            title: req.body.title,
            seed: req.body.seed,
            lastModified: new Date().getTime(),
          }
        )
        .then(() => res.sendStatus(200));
    })
    .catch((error) => res.status(500).send(error));
});

router.delete("/", requireAuthentication);
router.delete("/:id", function (req, res) {
  let story = dbService.get().get("story", { id: req.body.id });

  getStoryAuth(req, story);
  story
    .delete()
    .then(() => res.sendStatus(200))
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
