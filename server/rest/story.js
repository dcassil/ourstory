"use strict";

const dbService = require("../services/db");
const auth = require("../services/auth");
const router = require("express").Router();
const logger = require("../logger")(module);
const exception = require("../services/exception");
const storyHelpers = require("./storyHelpers");

const requireAuthentication = auth.requireAuthentication;

/**
 * schema
 *
 * title: <String>
 * authors: [{userId: user.id, userName: user.displayName}]
 * author: {id: <user.Id>, name: user.displayName}
 * seed: <String> first sentece of story
 * content: [StoryContent]
 * **/

router.get("/", function(req, res) {
  dbService
    .get()
    .get("story")
    .then(story => res.json(story));
});

router.get("/:id", function(req, res) {
  dbService
    .get()
    .get("story", { id: req.params.id })
    .then(story => res.json(story))
    .catch(e => exception.general(e, res));
});

router.get("/:id/content", function(req, res) {
  dbService
    .get()
    .get("storyContent", { storyId: req.params.id })
    .then(storyContent => res.json(storyContent))
    .catch(e => exception.general(e, res));
});

router.post("/", requireAuthentication);
router.post("/", function(req, res) {
  let newStory = storyHelpers.getStoryDataFromBody(req.body);

  dbService
    .get()
    .get("story", { title: newStory.title })
    .then(story => {
      if (story) {
        logger.error("create new story: title existed");
        res.status(400).send("story title existed");
      }
    })
    .catch(() => {
      dbService
        .get()
        .post("story", newStory)
        .then(result => {
          storyHelpers
            .saveNewContentAndFragment(
              result.id,
              0,
              req.body.user,
              req.body.fragment
            )
            .then();
          res.json(result);
        })
        .catch(e => exception.general(e, res));
    });
});

router.patch("/", requireAuthentication);
router.patch("/", function(req, res) {
  dbService
    .get()
    .get("story", { id: req.body.id })
    .then(story => {
      getStoryAuth(req, story);

      dbService
        .get()
        .patch(
          "story",
          { id: req.body.id },
          {
            title: req.body.title,
            seed: req.body.seed,
            lastModified: new Date().getTime()
          }
        )
        .then(() => res.sendStatus(200));
    });

  story.then(story => {
    if (existedAccount) {
      if (!auth.validateRoles(req.body.roles)) {
        res.status(400).send("Invalid roles");
      } else {
        dbService
          .get()
          .patch(
            "accounts",
            { username: req.body.username },
            {
              password: req.body.password,
              roles: req.body.roles
            }
          )
          .then(() => res.sendStatus(200));
      }
    } else {
      res.status(400).send("Account not existed: " + req.body.username);
    }
  });
});

router.delete("/", requireAuthentication);
router.delete("/:id", function(req, res) {
  let story = dbService.get().get("story", { id: req.body.id });

  getStoryAuth(req, story);
  story
    .delete()
    .then(() => res.sendStatus(200))
    .catch(error => res.status(500).send(error));

  // .delete("accounts", { username: req.params.id })
  // .then(() => res.sendStatus(200))
  // .catch(error => res.status(500).send(error));
});

let getStoryAuth = (req, story) => {
  let storyAuthData = {
    exists: story !== undefined,
    isAuthor: story.author === req.user.id,
    isDeletable: story.fragments.length > 1
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
