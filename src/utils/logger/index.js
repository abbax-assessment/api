const winston = require("winston");
const { inspect } = require("util");

const stripAnsi = (() => {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  ].join("|");
  const regex = new RegExp(pattern, "g");
  return (str) => {
    return str.replace(regex, "");
  };
})();

/*
 * Enumerable properties show up in for...in loops
 * but the Error object properties are set not to be Enumerable.
 * While calling JSON.stringify(err), most of it's properties don't show
 * because JSON.stringify internally uses something like for...in or Object.keys(err)
 * Bellow we replace the Error with new object which all it's properties are enumerable.
 */

const errorObjectFormat = winston.format((info) => {
  if (info.error instanceof Error) {
    const enumeratedErrorObject = {};
    Object.getOwnPropertyNames(info.error).forEach((key) => {
      enumeratedErrorObject[key] = info.error[key];
    });
    info.error = enumeratedErrorObject;
  }
  return info;
});

/*
 * Simple helper for stringifying all remaining
 * properties.
 */
function rest(info) {
  if (Object.keys(info).length === 0) {
    return "";
  }

  delete info.error?.logged;

  info.level = stripAnsi(info.level);
  info.logDate = new Date();

  try {
    return `\n${JSON.stringify(info)}`;
  } catch (e) {
    return `\n${inspect(info, { depth: null, compact: true, breakLength: Infinity })}`;
  }
}

function extractRequestMeta(req) {
  if (!req) {
    return {};
  }

  const baseRouteMatch = req.originalUrl.match(/([\/\?].*?){3}/);
  const routePattern = baseRouteMatch && baseRouteMatch[0].slice(0, -1);

  return {
    request: {
      originalUrl: req.originalUrl,
      routePattern: req.route?.path && `${routePattern}${req.route?.path}`,
      method: req.method,
      params: req.params,
      body: req.body,
      query: req.query
    },
  };
}

function extractResponseMeta(res) {
  if (!res) {
    return {};
  }
  return {
    response: {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    },
  };
}

const Logger = {
  create: (logName) => {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            errorObjectFormat(),
            winston.format.colorize(),
            winston.format.printf((info) => `[${info.level}] ${info.message}${rest(info)}`)
          ),
          silent: process.env.ENVIRONMENT === "test",
        }),
      ],
      defaultMeta: {
        ...(logName && { logName }),
      },
    });

    return {
      info: (message, {
        info,
        req,
        res,
      } = {}) => {
        logger.info(message, {
          info,
          ...extractRequestMeta(req),
          ...extractResponseMeta(res),
        });
      },
      error: (
        message,
        {
          info,
          error,
          req,
        } = {}
      ) => {
        if (!error || !error.logged) {
          const isDevEnv =
            process.env.ENVIRONMENT_NAME === "local" || process.env.ENVIRONMENT_NAME === "dev";
          const mes = error ? `${message}: ${isDevEnv ? error?.stack : error?.message}` : message;
          logger.error(mes, {
            info,
            error: { ...error, logged: true },
            ...extractRequestMeta(req),
          });
        }
      },
      debug: (message, info) => {
        logger.debug(message, { info });
      },
      warn: (
        message,
        {
          info,
          error,
          req,
        } = {}
      ) => {
        if (!error || !error.logged) {
          const isDevEnv =
            process.env.ENVIRONMENT_NAME === "local" || process.env.ENVIRONMENT_NAME === "dev";
          const mes = error ? `${message}: ${isDevEnv ? error?.stack : error?.message}` : message;
          logger.warn(mes, {
            info,
            error: { ...error, logged: true },
            ...extractRequestMeta(req),
          });
        }
      },
    };
  },
};

module.exports = Logger;
