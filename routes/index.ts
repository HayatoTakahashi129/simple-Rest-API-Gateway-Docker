import express, { Router } from "express";
const router: Router = express.Router();
import proxyRouter from "./proxy";

router.use("/", proxyRouter);

module.exports = router;
