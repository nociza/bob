import mongoose from "mongoose";
import debug from "debug";
import Config from "../config";
const dbDebugger = debug("app:db");

// Switching to test database
// NODE_ENV=test node index.js
// Db Work: dbDebugger('')

export const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  await mongoose
    .connect(Config.mongoDbUri)
    .then(() => {
      console.log("Connected to MongoDB...");
      dbDebugger(`Connect to ${Config.mongoDbUri}...`);
    })
    .catch((err: any) => console.log(err));
};

process.on("SIGTERM", function () {
  console.log("SIGTERM received, closing MongoDB connection");
  //mongoose.disconnect();
});

process.on("SIGINT", function () {
  console.log("SIGINT received, closing MongoDB connection");
  //mongoose.disconnect();
});
