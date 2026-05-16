require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
dbConnect();
const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening on port${port}`);
});
