const express = require("express");
const handler = require("../function/handler");

const router = express.Router();

router.get("/configEnv", handler.testEnv);

module.exports = router;
