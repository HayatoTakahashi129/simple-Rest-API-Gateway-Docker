import express, { Application } from "express";
const jwtAuthorizer = require("./middlewares/jwtAuthorizer");

const indexRouter = require("./routes/index");

const app: Application = express();

app.use(jwtAuthorizer);
app.use("/", indexRouter);

export default app;
