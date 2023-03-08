// server/config.ts
import "dotenv/config";
interface Config {
  /** The port that the express server should bind to. */
  port: number;
  mongoDbUri: string;
  bingCookie?: string;
}

const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 6000,
  mongoDbUri: process.env.MONGODB_URI || "",
  bingCookie: process.env.BING_COOKIE,
};

// TODO: add option to require config options

export default config;
