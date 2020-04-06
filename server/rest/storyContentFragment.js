"use strict";

const dbService = require("../services/db");
const auth = require("../services/auth");
const exception = require("../services/exception");
const router = require("express").Router();
const storyHelpers = require("./storyHelpers");

const requireAuthentication = auth.requireAuthentication;

/**
 * id: <number>
 * id: <number>
 * text: <String>
 * author: {id: author.id, authorName: author.displayName}
 * upVotes: <Array>
 * downVotes: <Array>
 * **/

router.get("/:id", function (req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.params.id })
    .then((fragment) => res.json(fragment))
    .catch((e) => exception.general(e, res));
});

router.post("/:id/upvote", requireAuthentication);
router.post("/:id/upvote", function (req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.body.id })
    .then((fragment) => {
      dbService
        .get()
        .patch("storyContentFragment", {
          upVotes: fragment.upVotes.push(req.user.id),
        })
        .then(() => {
          storyHelpers.evaluateContentVotes(
            req.body.contentId,
            req.body.id,
            "up"
          );
          res.json(fragment);
        });
    });
});

router.post("/:id/downvote", requireAuthentication);
router.post("/:id/downvote", function (req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.body.id })
    .then((fragment) => {
      dbService
        .get()
        .patch("storyContentFragment", {
          downVotes: fragment.downVotes.push(req.user.id),
        })
        .then((fragment) => {
          storyHelpers.evaluateContentVotes(
            req.body.contentId,
            req.body.id,
            "down"
          );
          res.json(fragment);
        });
    });
});

router.patch("/", requireAuthentication);
router.patch("/", function (req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.body.id })
    .then((fragment) => {
      checkData(req.author.id, fragment);
      dbService
        .get()
        .patch(
          "storyContentFragment",
          { id: req.body.id },
          {
            title: req.body.title,
            seed: req.body.seed,
            lastModified: new Date().getTime(),
          }
        )
        .then(() => res.sendStatus(200))
        .catch((e) => exception.general(e, res));
    })
    .catch((e) => exception.general(e, res));
});

router.delete("/", requireAuthentication);
router.delete("/:id", function (req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.params.id })
    .then((fragment) => {
      checkData(req.author.id, fragment);
      dbService
        .get()
        .delete("storyContentFragment", { id: fragment.id })
        .then(() => res.sendStatus(200))
        .catch((e) => exception.general(e, res));
    })
    .catch((e) => exception.general(e, res));
});

let checkData = (authorId, fragment) => {
  let checkData = {
    exists: fragment !== undefined,
    isAuthor: fragment.author.id === authorId,
    isDeletable: fragment.author.id === authorId,
  };

  if (!checkData.exists) {
    let message = "No story found for the id provided";

    exception.log(message);
    res.status(404).send(new Error(message));
  }

  if (!checkData.isAuthor) {
    let message =
      "Only the story owner or system admin can edit or delete this story";

    exception.log(message);
    res.status(401).send(new Error(message));
  }

  if (!checkData.isAuthor) {
    let message = "Only the author can delete this fragment.";

    exception.log(message);
    res.status(403).send(new Error(message));
  }

  return checkData;
};

module.exports = router;
