require("dotenv").config();
require('module-alias/register');
const { swaggerUi, swaggerSpec } = require("./swagger");
const routes = require("./routes");
const cors = require('cors');

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", routes);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
