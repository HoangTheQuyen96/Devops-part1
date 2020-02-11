const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expressWinston = require("express-winston");
const winston = require('winston');

module.exports = router => (logger = console) => {
  const app = express();

  app.use(bodyParser.json());

  app.use("/", router);

  app.use(
    cors({
      credentials: true,
      origin: [],
      optionsSuccessStatus: 200
    })
  );

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      meta: false,
      expressFormat: true,
      colorize: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );

  app.use((req, res, next) =>
    req.method !== "GET" &&
    !/application\/json/.test(req.headers["content-type"])
      ? (() => {
          app.emit("error", {
            errors: [{ code: 415, message: "unsupported media type" }]
          });
          res.status(415).json({
            status: 0,
            reason: "unsupported media type",
            errors: [{ code: 415, message: "unsupported media type" }]
          });
        })()
      : next()
  );

  app.use(
    async (err, req, res, next) =>
      await next(
        !err.status
          ? (() => {
              res.status(err.status || 500).json(err);
              app.emit("error", err.errors);
            })()
          : (() => {
              res.status(err.status || 500).json({
                status: 0,
                reason: "unexpected error",
                errors: [{ code: 500, message: "unexpected error" }]
              });
              app.emit("error", {
                errors: [{ code: 500, message: "unexpected error" }]
              });
            })()
        // await next()
      )
  );

  app.use(async (req, res, next) => {
    res.status(404).json({
      status: 0,
      reason: "resource not found",
      errors: [{ code: 404, message: "resource not found" }]
    });

    app.emit("error", {
      errors: [{ code: 404, message: "not found" }]
    });

    await next();
  });

  app.on("error", errors => {
    logger.error(errors);
  });

  return app;
};
