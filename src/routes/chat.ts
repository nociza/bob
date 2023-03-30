import express from "express";
import { BingChat } from "bing-chat";
import Config from "../config.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from Bob!");
});

router.post("/:message", async (req, res) => {
  try {
    const message = req.params.message;
    const api = new BingChat({
      cookie: Config.bingChatCookie || "",
    });
    const response = await api.sendMessage(message);
    return res.status(200).send(response.text);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .send(
        "Sorry about that! Bob's having a bad day. He's having troubles with " +
          error.message
      );
  }
});

export default router;
