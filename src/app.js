const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health-check", (req, res) =>
  res.end(JSON.stringify({ status: "ok" }))
);

app.use("/api", routes);

module.exports = app;
