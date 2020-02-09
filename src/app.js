const config = require("config");
const router = require("./function/router");
const logger = require("./core/logger.core");
const app = require("./core/express.core")(router)(logger);

const startServer = () =>
  new Promise((resolve, reject) => {
    app.listen(config.get("port") || 8000, err => {
      if (err) return reject(err);
      return resolve();
    });
  });

const start = async () => {
  try {
    await startServer();
    logger.info(
      `${"[MAIN]"} Server is listening on port ${config.get("port")}`
    );
  } catch (error) {
    logger.info(error);
    process.exit(1);
  }
};

start();

const shutdown = signal => async err => {
  logger.log(`${signal}...`);
  if (err) logger.error(err.stack || err);

  logger.info(`${signal} signal received.`);
  process.exit(1);
};

process.on("error", shutdown("err"));

process.on("SIGTERM", shutdown("SIGNTERM"));
