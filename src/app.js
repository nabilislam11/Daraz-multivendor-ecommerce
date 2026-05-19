require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-Parser");
const dbConnect = require("./config/dbConnect");
dbConnect();
const authRoutes = require("./routes/auth");
const swaggerUi = require("swagger-ui-express");
const swaggerSpacs = require("./config/swagger");
const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpacs));
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "htto://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);

const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port${port}`);
});
