var express = require("express");
var logger = require("morgan");
const jwtAuthorizer = require("./middlewares/jwtAuthorizer");

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(jwtAuthorizer);
app.use("/", indexRouter);

module.exports = app;
