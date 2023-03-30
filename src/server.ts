import express, { application } from "express";
import Config from "./config";
import { connectDB } from "./utils/db";

// Link Routes
import chat from "./routes/chat.js";
import imgen from "./routes/imgen.js";

//(async () => connectDB())();

// Startup Express and Connect MongoDB
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from Bob!");
});

// Use Routes
app.use("/chat", chat);
app.use("/imgen", imgen);

export default app;
