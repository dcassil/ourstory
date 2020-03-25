"use strict";

const dbService = require("../services/db");
const router = require("express").Router();

router.post("/", function(req, res) {
  const newAccount = {
    username: req.body.username,
    password: req.body.password,
    roles: ["USER"]
  };

  dbService
    .get()
    .get("accounts", { username: newAccount.username })
    .then(existedAccount => {
      if (existedAccount) {
        logger.error("create new account: Username existed");
        res.status(400).send("Username existed");
      } else {
        dbService
          .get()
          .post("accounts", newAccount)
          .then(result => res.json(result));
      }
    });
});

module.exports = router;
