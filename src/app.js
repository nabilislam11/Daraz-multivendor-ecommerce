require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
dbConnect();
const authRoutes = require("./routes/auth");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port${port}`);
});
