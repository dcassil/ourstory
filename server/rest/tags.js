"use strict";

const dbService = require("../services/db");
const router = require("express").Router();

router.get("/", function (req, res) {
  dbService
    .get()
    .get("tags")
    .then((tags) => res.json(tags));
});

module.exports = router;
