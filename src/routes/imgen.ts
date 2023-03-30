import axios from "axios";
import fs from "fs";
import path from "path";
import querystring from "querystring";
import { Router } from "express";
import { performance } from "perf_hooks";
import Config from "../config.js";

const BING_URL = "https://www.bing.com";

const router = Router();

const createSession = (authCookie: string) => {
  const session = axios.create({
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      referrer: "https://www.bing.com/images/create/",
      origin: "https://www.bing.com",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
    },
  });

  session.defaults.headers.Cookie = `_U=${authCookie}`;

  return session;
};

const getImages = async (session: any, prompt: string) => {
  console.log("Sending request...");
  const urlEncodedPrompt = querystring.escape(prompt);
  let url = `${BING_URL}/images/create?q=${urlEncodedPrompt}&rt=4&FORM=GENCRE`;
  let response = await session
    .post(url, { maxRedirects: 0 })
    .catch((err: any) => {
      if (err.responseCode !== 302) {
        throw new Error("Redirect failed");
      }
      return err.response;
    });

  if (response.status !== 302) {
    url = `${BING_URL}/images/create?q=${urlEncodedPrompt}&rt=3&FORM=GENCRE`;
    response = await session.post(url, { maxRedirects: 0, timeout: 200000 });
    if (response.status !== 302) {
      console.error(`ERROR: ${response.data}`);
      throw new Error("Redirect failed");
    }
  }

  const redirectUrl = response.headers.location.replace("&nfy=1", "");
  const requestId = redirectUrl.split("id=")[1];
  await session.get(`${BING_URL}${redirectUrl}`);

  const pollingUrl = `${BING_URL}/images/create/async/results/${requestId}?q=${urlEncodedPrompt}`;

  console.log("Waiting for results...");
  const startWait = performance.now();
  let imagesResponse;

  while (true) {
    if (performance.now() - startWait > 300000) {
      throw new Error("Timeout error");
    }
    console.log(".", { end: "", flush: true });
    imagesResponse = await session.get(pollingUrl);
    if (imagesResponse.status !== 200) {
      throw new Error("Could not get results");
    }
    if (imagesResponse.data === "") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    } else {
      break;
    }
  }

  const imageLinks = imagesResponse.data
    .match(/src="([^"]+)"/g)
    .map((src: string) => src.slice(5, -1));
  const normalImageLinks: string[] = Array.from(
    new Set(imageLinks.map((link: string) => link.split("?w=")[0]))
  );

  const badImages = [
    "https://r.bing.com/rp/in-2zU3AJUdkgFe7ZKv19yPBHVs.png",
    "https://r.bing.com/rp/TX9QuO3WzcCJz1uaaSwQAz39Kb0.jpg",
  ];

  for (const im of normalImageLinks) {
    if (badImages.includes(im)) {
      throw new Error("Bad images");
    }
  }

  if (normalImageLinks.length === 0) {
    throw new Error("No images");
  }

  return normalImageLinks;
};

const saveImages = async (session: any, links: string[], outputDir: string) => {
  console.log("\nDownloading images...");
  try {
    fs.mkdirSync(outputDir, { recursive: true });
  } catch (err: any) {
    if (err.code !== "EEXIST") throw err;
  }

  let imageNum = 0;
  for (const link of links) {
    try {
      const response = await session.get(link, { responseType: "stream" });
      const outputPath = path.join(outputDir, `${imageNum}.jpeg`);
      const writer = fs.createWriteStream(outputPath);

      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      imageNum += 1;
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        throw new Error(
          "Inappropriate contents found in the generated images. Please try again or try another prompt."
        );
      } else {
        throw err;
      }
    }
  }
};

router.post("/generate/:prompt", async (req: any, res: any) => {
  try {
    const { prompt } = req.params;
    const authCookie = Config.bingCookie;
    const outputDir = `${Config.tempDir}/${prompt}`;

    if (!authCookie || !prompt) {
      return res.status(500).send("Missing parameters");
    }

    // Create image generator session
    const session = createSession(authCookie);
    const imageLinks = await getImages(session, prompt);
    await saveImages(session, imageLinks, outputDir);

    // Read saved images from the output directory
    const imageFiles = fs.readdirSync(outputDir);
    const images = imageFiles.map((filename) => {
      const filePath = path.join(outputDir, filename);
      const fileData = fs.readFileSync(filePath);
      return {
        filename,
        data: fileData.toString("base64"),
      };
    });

    return res.status(200).send(images);
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
});

export default router;
