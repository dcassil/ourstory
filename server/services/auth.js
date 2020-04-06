"use strict";

const _ = require("lodash");
const crypto = require("crypto");
const config = require("config");
const jwt = require("jsonwebtoken");
const dbService = require("../services/db");

function encrypt(text) {
  const cipher = crypto.createCipher("aes-256-ctr", config.server.auth.secret);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

function decrypt(text) {
  const decipher = crypto.createDecipher(
    "aes-256-ctr",
    config.server.auth.secret
  );
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

function _getContentOwner(routeBase, id) {
  switch (routeBase) {
    case "/rest/story":
      return dbService
        .get()
        .get("story", { id })
        .then((story) => story.author);
      break;
    case "/rest/fragment":
      return dbService
        .get()
        .get("storyContentFragment", { id })
        .then((fragment) => fragment.author);
      break;
    default:
      return Promise.reject(
        new Error("No matching rule for path: " + routeBase)
      );
  }
}

module.exports = {
  ROLES: {
    ADMIN: "ADMIN",
    USER: "USER",
  },
  generateToken: function (account) {
    return jwt.sign(
      { data: encrypt(JSON.stringify(account)) },
      config.server.auth.secret,
      { expiresIn: "5d" }
    );
  },
  validateRoles: function (roles) {
    return _.intersection(roles, _.keys(this.ROLES)).length === roles.length;
  },
  isAdmin(req) {
    return _.intersection(req.user.roles, ["ADMIN"]).length > 0;
  },
  getUser(req) {
    return req.user;
  },
  validateContentOwner(req, res, next) {
    let routeBase = req.baseUrl;
    let { id } = req.params;

    return _getContentOwner(routeBase, id)
      .then((owner) => {
        let isOwner = owner.id === req.user.id;

        if (!isOwner) {
          res
            .status(401)
            .send(
              new Error(
                "Only the story owner or system admin can edit or delete this story"
              )
            );
        }

        next();
      })
      .catch((e) => res.status(500).send(e));
  },
  requireAuthentication: function (req, res, next) {
    let token = getToken(req);
    if (token) {
      jwt.verify(token, config.server.auth.secret, function (err, decoded) {
        if (err) {
          if (err.expiredAt) {
            return res.status(401).json({
              success: false,
              message: "Login Expired",
              reason: "expired",
            });
          }
          return res
            .status(401)
            .json({ success: false, message: "Failed to authenticate token." });
        } else {
          req.user = JSON.parse(decrypt(decoded.data));
          next();
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }
  },
  requireAuthorization: function (roles) {
    return function (req, res, next) {
      if (_.intersection(req.user.roles, roles).length === 0) {
        res.status(403).send("Access denied");
      } else {
        next();
      }
    };
  },
};

function getToken(req) {
  let token = undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }
  return token;
}
