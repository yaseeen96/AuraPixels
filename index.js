import express from "express";
import dotenv from "dotenv";
// used to read env files
dotenv.config();

const app = express();

app.get("/status", (req, res) => {
  res.json({ status: "working" }).status(200);
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
