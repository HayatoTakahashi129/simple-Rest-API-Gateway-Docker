import express, { Application } from "express";
import jwtAuthorizer from "./middlewares/jwtAuthorizer";

import indexRouter from "./routes/index";

const app: Application = express();

app.use(jwtAuthorizer);
app.use("/", indexRouter);

export default app;
