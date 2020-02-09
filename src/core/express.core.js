const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const events = require('events');

module.exports = router => (logger = console) => {
  const errEmitter = new events.EventEmitter();

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

  app.use(async (req, res, next) => {
    res.status(404).json({
      status: 0,
      reason: "resource not found",
      errors: [{ code: 404, message: "resource not found" }]
    });

    errEmitter.emit("error", {
      errors: [{ code: 404, message: "not found" }]
    });

    await next();
  });

  errEmitter.on("error", errors => {
    logger.error(errors);
  });

  return app;
};
