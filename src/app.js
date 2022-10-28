const express = require("express");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("v1", api);

module.exports = app;
