const path = require("path");
const config = require("config");

const dbService = require("./server/services/db");
dbService.init(config.server.dbType);

const Server = require("./server");
const server = new Server(config.server);

if (config.server.serveWeb === "true") {
  switch (config.web.env) {
    case "development": {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!  dev");

      const webpackUtil = require("./web/webpack-dev-server-util");
      webpackUtil.appendMiddleware(server.getExpressApp());
      break;
    }
    case "test": {
      // Only run backend only
      break;
    }
    case "production":
    default: {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!  prod");

      const express = require("express");
      server
        .getExpressApp()
        .use(express.static(path.join(__dirname, "./web/dist")));

      // Take care of manual url
      server.getExpressApp().get("*", function (req, res) {
        res.sendFile(path.resolve(__dirname, "./web/dist/index.html"));
      });
      break;
    }
  }
}

server.start();
