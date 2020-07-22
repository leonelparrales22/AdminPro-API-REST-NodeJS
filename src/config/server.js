const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Settings
app.set("port", process.env.PORT || 3100);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


module.exports = app;
