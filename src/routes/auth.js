const express = require("express");
const { registration, login } = require("../controller/authController");
const { verifyEmail } = require("../controller/verifyEmail");
const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register
 *   post:
 *       summey: Register a new user (customer or vendor)
 *       tags:[Auth]
 *       requestBody:
 *            required:true
 *            content:
 *               application/json:
 *                    schema:
 *                          type:object
 *                          required:
 *                                 - name
 *                                 - email
 *                                 - password
 *                           properties:
 *                                  name:
 *                                      type:string
 *                                  email:
 *                                      type:string
 *                                      formate:emial
 *                                  password:
 *                                       type:string
 *                                       formate: password
 *                                  role:
 *                                       type:string
 *                                       enum:["customer","vendor"]
 *       responses:
 *             201:
 *                 description: USer registration succesfull
 *             401:
 *                 description: Bad requiest
 *
 */
router.post("./registration", registration);
router.get("./verify-email", verifyEmail);
router.post("./login", login);

module.exports = router;
