"use strict";

const dbService = require("../services/db");
const auth = require("../services/auth");
const exception = require("../services/exception");
const router = require("express").Router();

const requireAuthentication = auth.requireAuthentication;

/**
 * id: <number>
 * id: <number>
 * text: <String>
 * author: {id: author.id, authorName: author.displayName}
 * upVotes: <number>
 * downVotes: <number>
 * **/

router.get("/:storyId/content/:contentId/fragments/:id", function(req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.params.id })
    .then(fragment => res.json(fragment))
    .catch(e => exception.general(e, res));
});

router.get("/:storyId/content/:contentId/fragments", function(req, res) {
  dbService
    .get()
    .search("storyContentFragment", {
      storyContentId: req.params.contentId
    })
    .then(fragments => res.json(fragments))
    .catch(e => exception.general(e, res));
});

router.post("/:storyId/content/:contentId/fragments", requireAuthentication);
router.post("/:storyId/content/:contentId/fragments", function(req, res) {
  let fragment = req.body;

  dbService
    .get()
    .get("storyContent", { id: req.body.contentId })
    .then(storyContent => {
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
          upVotes: "0",
          downVotes: "0",
          lastModified: new Date().getTime(),
          createdDate: new Date().getTime()
        })
        .then(savedFragment =>
          dbService
            .get()
            .get("storyContentFragment")
            .then(fragments =>
              dbService
                .get()
                .patch(
                  "storyContent",
                  { id: storyContent.id },
                  {
                    lastFragment: savedFragment,
                    totalFragments: fragments.length
                  }
                )
                .then(response => {
                  res.sendStatus(200);
                })
            )
        );
    })
    .catch(e => exception.general(e, res));
});

router.patch("/", requireAuthentication);
router.patch("/", function(req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.body.id })
    .then(fragment => {
      checkData(req.author.id, fragment);
      dbService
        .get()
        .patch(
          "storyContentFragment",
          { id: req.body.id },
          {
            title: req.body.title,
            seed: req.body.seed,
            lastModified: new Date().getTime()
          }
        )
        .then(() => res.sendStatus(200))
        .catch(e => exception.general(e, res));
    })
    .catch(e => exception.general(e, res));
});

router.delete("/", requireAuthentication);
router.delete("/:id", function(req, res) {
  dbService
    .get()
    .get("storyContentFragment", { id: req.params.id })
    .then(fragment => {
      checkData(req.author.id, fragment);
      dbService
        .get()
        .delete("storyContentFragment", { id: fragment.id })
        .then(() => res.sendStatus(200))
        .catch(e => exception.general(e, res));
    })
    .catch(e => exception.general(e, res));
});

let checkData = (authorId, fragment) => {
  let checkData = {
    exists: fragment !== undefined,
    isAuthor: fragment.author.id === authorId,
    isDeletable: fragment.author.id === authorId
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
