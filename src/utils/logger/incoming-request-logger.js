const Logger = require("./index.js");

const logger = Logger.create();

const incomingRequestLogger = (req, res, next) => {
  const requestUri = (req.originalUrl || req.url).split("?")[0];

  logger.info(`Incoming request for ${requestUri}`, {
    info: {
      requestMethod: req.method,
      requestUri
    },
    req
  });

  return next();
};

module.exports = incomingRequestLogger;