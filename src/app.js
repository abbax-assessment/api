const AWSXRay = require('aws-xray-sdk');
AWSXRay.captureAWS(require("aws-sdk"));
AWSXRay.captureHTTPsGlobal(require("http"));
AWSXRay.captureHTTPsGlobal(require("https"));

const express = require("express");
const routes = require("./routes");
const cors = require('cors');

const app = express();

app.use(AWSXRay.express.openSegment(`api-server-${process.env.ENVIRONMENT}`));

app.use(cors());
app.use(express.json());

app.get("/health-check", (req, res) =>
  res.end(JSON.stringify({ status: "ok" }))
);

app.use("/api", routes);

app.use(AWSXRay.express.closeSegment());

module.exports = app;
