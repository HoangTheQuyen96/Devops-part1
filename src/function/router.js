const express = require("express");
const handler = require("../function/handler");

const router = express.Router();

router.get("/configEnv", handler.testEnv);
router.post("/testMongo", handler.testMongo);

module.exports = router;
