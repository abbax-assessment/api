const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());

// Or manually setting headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow HTTP methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow headers
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.get("/health-check", (req, res) =>
  res.end(JSON.stringify({ status: "ok" }))
);

app.use("/api", routes);

module.exports = app;
