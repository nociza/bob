import express from "express";
import { BingChat } from "bing-chat";
import Config from "../config.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from Bob!");
});

router.get("/", async (req, res) => {
  const { message } = req.body;
  const api = new BingChat({
    cookie: Config.bingCookie || "",
  });
  const response = await api.sendMessage(message, {
    onProgress: (partialResponse) => res.write(partialResponse),
  });
  res.end(response);
});

export default router;
