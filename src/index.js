require('aws-sdk/lib/maintenance_mode_message').suppress = true;

if (process.env.ENVIRONMENT_NAME === "local") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const Logger = require("./utils/logger");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const logger = Logger.create();


app.listen(PORT, () => {
  logger.info(`⚡Server is running at http://localhost:${PORT}`);
});


