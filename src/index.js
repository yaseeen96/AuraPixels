import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
// used to read env files
dotenv.config();
const port = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed ", err);
  });
