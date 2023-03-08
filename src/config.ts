// server/config.ts
import nodeConfig from "config";
import "dotenv/config";
interface Config {
  /** The port that the express server should bind to. */
  port: number;
  /** The secret key used to sign JWTs. */
  jwtPrivateKey: string;
  emailPrivateKey: string;
  accessToken: string;
  mongoDbUri: string;
}

const config: Config = {
  port: nodeConfig.get<number>("port"),
  jwtPrivateKey:
    process.env.JWT_PRIVATE_KEY || nodeConfig.get<string>("jwtPrivateKey"),
  emailPrivateKey: process.env.EMAIL_PRIV_KEY,
  accessToken: process.env.ACCESS_TOKEN,
  mongoDbUri: nodeConfig.get<string>("db"),
};

// TODO: add option to require config options

export default config;
