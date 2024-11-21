const dotenv = require("dotenv");
dotenv.config();
const Logger = require("./utils/logger");
const app = require("./app");

const PORT = process.env.PORT || 3001;
const logger = Logger.create();

const eventStream = require('event-stream');
console.log('Snyk test project using event-stream');

app.listen(PORT, () => {
  logger.info(`⚡Server is running at http://localhost:${PORT}`);
});
