"use strict";

const dbService = require("../services/db");

function updateTagsList(newTags) {
  dbService
    .get()
    .get("tags")
    .then((tags) => {
      newTags.forEach((tag) => {
        if (tags.includes(tag)) {
          return;
        }
        tags.push(tag);
      });
      dbService.get().set("tags", tags);
    });
}

module.exports = {
  updateTagsList,
};
