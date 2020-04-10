"use strict";

const dbService = require("../services/db");
const router = require("express").Router();
const auth = require("../services/auth");

router.post("/abuse", auth.requireAuthentication);
router.post("/abuse", function (req, res) {
  if (req.body.fragmentId) {
    dbService
      .get()
      .get("storyContentFragment", { id: req.body.fragmentId })
      .then((fragment) => {
        let data = { ...req.body, ...fragment, reporterUID: req.user.id };

        postAbuse(data).then(() => res.status(200).send("ok"));
      });
  } else {
    dbService
      .get()
      .get("story", { id: req.body.storyId })
      .then((story) => {
        let data = { ...req.body, ...story };

        postAbuse(data).then(() => res.status(200).send("ok"));
      });
  }
});

function postAbuse(data) {
  return dbService
    .get()
    .post("abuse", data)
    .then((results) => {
      dbService
        .get()
        .get("accounts", { id: results.author.id })
        .then((account) => {
          dbService
            .get()
            .patch(
              "accounts",
              { id: results.author.id },
              { abuseMarks: [...account.abuseMarks, results.id] }
            );
        });
    });
}

module.exports = router;
