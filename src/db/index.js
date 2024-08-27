import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URL}/${DB_NAME}`
    );
    console.log(`Database connected to  ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("mongoDB connection failed");
    process.exit(1);
  }
}

export default connectDB;
