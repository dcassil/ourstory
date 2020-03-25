"use strict";

const logger = require("../logger")(module);

module.exports = {
  general: (e, res) => {
    logger.error(e);
    res.status(500).send(e);
  },
  log: logger.error
};
