

const express = require("express");
const routes = require("./routes");
const cors = require('cors');
const getXray = require("./utils/xray");

const AWSXRay = getXray();
const app = express();

if (AWSXRay) {
  app.use(AWSXRay.express.openSegment(`api-server-${process.env.ENVIRONMENT}`));
}

if (process.env.ENVIRONMENT === "local") {
  app.use(cors());
}
app.use(express.json());

app.get("/health-check", (req, res) =>
  res.status(200).send('OK')
);

app.use("/api", routes);

if (AWSXRay) {
  app.use(AWSXRay.express.closeSegment());
}

module.exports = app;
