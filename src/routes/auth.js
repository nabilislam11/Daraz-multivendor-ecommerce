const express = require("express");
const {
  registration,
  login,
  refreshToken,
} = require("../controller/authController");
const { verifyEmail } = require("../controller/verifyEmail");

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user (customer or vendor)
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - name
 *               - email
 *               - password
 *
 *             properties:
 *               name:
 *                 type: string
 *
 *               email:
 *                 type: string
 *                 format: email
 *
 *               password:
 *                 type: string
 *
 *               role:
 *                 type: string
 *                 enum: [customer, vendor]
 *
 *     responses:
 *       201:
 *         description: User registration successful
 *
 *       400:
 *         description: Bad request
 */

router.post("/register", registration);

router.get("/verify-email", verifyEmail);

router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
