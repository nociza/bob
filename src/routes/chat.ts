import express from "express";
import { BingChat } from "bing-chat";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from Bob!");
});

router.post("/", async (req, res) => {
  const { message } = req.body;
  const api = new BingChat({
    cookie: process.env.BING_COOKIE,
  });
  const response = await api.sendMessage(message, {
    onProgress: (partialResponse) => res.write(partialResponse),
  });
  res.end(response);
});

export default router;
