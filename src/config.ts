// server/config.ts
import nodeConfig from "config";
import "dotenv/config";
interface Config {
  /** The port that the express server should bind to. */
  port: number;
  mongoDbUri: string;
}

const config: Config = {
  port: nodeConfig.get<number>("port"),
  mongoDbUri: nodeConfig.get<string>("db"),
};

// TODO: add option to require config options

export default config;
