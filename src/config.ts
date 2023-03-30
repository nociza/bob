// server/config.ts
import "dotenv/config";
interface Config {
  /** The port that the express server should bind to. */
  port: number;
  mongoDbUri: string;
  bingChatCookie?: string;
  bingImageCookie?: string;
  tempDir?: string;
}

const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 6000,
  mongoDbUri: process.env.MONGODB_URI || "",
  bingChatCookie: process.env.BING_CHAT_COOKIE,
  bingImageCookie: process.env.BING_IMAGE_COOKIE,
  tempDir: process.env.TEMP_DIR || "/tmp",
};

// TODO: add option to require config options

export default config;
