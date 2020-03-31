"use strict";

const _ = require("lodash");
const low = require("lowdb");
const fileAsync = require("lowdb/lib/storages/file-async");
const logger = require("../../logger")(module);

const DEFAULT_SCHEMA = {
  accounts: [],
  links: [],
  settings: {},
  story: [],
  storyContent: [],
  storyContentFragment: []
};

class LowDb {
  constructor(config) {
    this.config = config;

    logger.info("Init database LowDb: " + config.databaseFileName);
    this.lowDb = low(config.databaseFileName, {
      storage: fileAsync
    });

    this.lowDb.defaults(DEFAULT_SCHEMA).write();
  }

  get(type, match) {
    return new Promise((resolve, reject) => {
      if (match) {
        let value = this.lowDb
          .get(type)
          .find(match)
          .value();

        if (value) resolve(value);
        else reject(404);
      } else {
        resolve(this.lowDb.get(type).value());
      }
    });
  }

  search(type, match) {
    return new Promise((resolve, reject) => {
      resolve(
        this.lowDb
          .get(type)
          .filter(match)
          .value()
      );
    });
  }

  set(path, item) {
    return new Promise((resolve, reject) => {
      this.lowDb.set(path, item).write();
      resolve(item);
    });
  }

  post(type, item) {
    return new Promise((resolve, reject) => {
      let timeout = 2000;
      let interval = setInterval(() => {
        let blocker = this.lowDb.get("blockers").find({ id: type });
        let blockerValue = blocker.value();

        if (!blockerValue || !blockerValue.blocked) {
          blocker.assign({ blocked: true }).write();

          let target = this.lowDb.get(type);
          let records = target.value();
          let lastId = -1;

          if (records && records.length > 0) {
            lastId = records.sort((a, b) => a.id * 1 < b.id * 1)[0].id;
          }

          item.id = lastId * 1 + 1;
          target.push(item).write();

          blocker.assign({ blocked: false }).write();
          resolve(item);
          clearInterval(interval);
        }

        if (timeout <= 0) {
          reject("Failed to write because db was blocked, timeout");
          clearInterval(interval);
        }

        timeout -= 100;
      }, 100);
    });
  }

  //   post(type, item) {
  //     return new Promise((resolve, reject) => {
  //       this.lowDb
  //         .get(type)
  //         .push(item)
  //         .write();
  //       resolve(item);
  //     });
  //   }

  patch(type, match, item) {
    return new Promise((resolve, reject) => {
      this.lowDb
        .get(type)
        .find(match)
        .assign(item)
        .write();
      resolve(item);
    });
  }

  delete(type, match) {
    return new Promise((resolve, reject) => {
      if (
        this.lowDb
          .get(type)
          .find(match)
          .value()
      ) {
        this.lowDb
          .get(type)
          .remove(match)
          .write();
        resolve();
      } else {
        reject("Item not found");
      }
    });
  }

  clear() {
    this.lowDb.setState({});
  }
}

module.exports = LowDb;
