const express = require("express");
const { registration } = require("../controller/authController");
const { verifyEmail } = require("../controller/verifyEmail");
const router = express.Router();
router.post("./registration", registration);
router.get("./verify-email", verifyEmail);
module.exports = router;
