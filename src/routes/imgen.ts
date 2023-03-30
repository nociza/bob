import { Router } from "express";
import { generateImageFiles, generateImagesLinks } from "bimg";

const router = Router();

router.post("/links-only/:prompt", async (req: any, res: any) => {
  try {
    const { prompt } = req.params;
    const imageLinks = await generateImagesLinks(prompt);
    return res.status(200).send(imageLinks);
  } catch (err: any) {
    console.trace(err);
    return res.status(500).send(err.message);
  }
});

router.post("/:prompt", async (req: any, res: any) => {
  try {
    const { prompt } = req.params;
    const images = await generateImageFiles(prompt);
    return res.status(200).send(images);
  } catch (err: any) {
    console.trace(err);
    return res.status(500).send(err.message);
  }
});

export default router;
