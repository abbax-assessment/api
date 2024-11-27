

const express = require("express");
const routes = require("./routes");
const cors = require('cors');
const getXray = require("./utils/xray");

const AWSXRay = getXray();
const app = express();



app.use(cors());
app.use(express.json());

app.get("/health-check", (req, res) =>
  res.end(JSON.stringify({ status: "ok" }))
);

app.use("/api", routes);

if (AWSXRay) {
  app.use(AWSXRay.express.closeSegment());
}

module.exports = app;
