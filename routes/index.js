const express = require("express");
const router = express.Router();
const proxyRouter = require("./proxy");

router.use("/", proxyRouter);

module.exports = router;
