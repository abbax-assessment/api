

const express = require("express");
const routes = require("./routes");
const cors = require('cors');
const getXray = require("./utils/xray");
const incomingRequestLogger = require("./utils/logger/incoming-request-logger")

const AWSXRay = getXray();
const app = express();

if (AWSXRay) {
  app.use(AWSXRay.express.openSegment(`api-server-${process.env.ENVIRONMENT}`));
}

app.use(cors());
if (process.env.ENVIRONMENT === "local") {
}
app.use(express.json());

app.get("/health-check", (req, res) =>
  res.status(200).send('OK')
);

app.use(incomingRequestLogger);
app.use(routes);

if (AWSXRay) {
  app.use(AWSXRay.express.closeSegment());
}

module.exports = app;
