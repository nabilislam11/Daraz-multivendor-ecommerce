const express = require("express");
const { registration } = require("../controller/authController");
const router = express.Router();
router.post("./registration", registration);
module.exports = router;
