import axios from "axios";
import * as express from "express";
import { Request } from "express";
import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
import { isLegacy } from "./view-path";

async function processImage(req: Request, data: Buffer) {
  const legacy = isLegacy(req);
  const fit = (req.query.fit || "cover") as
    | "fill"
    | "contain"
    | "cover"
    | "inside"
    | "outside";

  let image = sharp(data);
  const metadata = await image.metadata();

  const originalWidth = metadata.width || 0;
  let height = metadata.height || 0;
  let width = metadata.width || 700;
  if (req.query.aspectRatio) {
    const [w, h] = (req.query.aspectRatio as string)
      .split(":")
      .map((o) => parseInt(o));

    height = Math.floor((h * width) / w);
  }

  if (req.params.width) {
    width = parseInt(req.params.width);
  }

  if (legacy) {
    width = req.params.legacyWidth ? parseInt(req.params.legacyWidth) : 700;
  }

  height = Math.floor((height * width) / originalWidth);

  image = image.resize(width, height, { fit });

  if (metadata.format === "png") {
    image = image.png({
      quality: 100,
    });
  } else {
    image = image.jpeg({
      quality: 100,
      chromaSubsampling: "4:4:4",
    });
  }

  return image.toBuffer();
}

export function images(app: express.Express) {
  app.get("/post/asset/:width/:legacyWidth/:id/*", async (req, res, next) => {
    try {
      const param = req.params[0];
      const buffer = fs.readFileSync(
        path.join(__dirname, "../contents/posts", req.params.id, param)
      );
      const result = await processImage(req, buffer);
      res.type("jpg");
      res.send(result);
    } catch (_) {
      next();
    }
  });

  app.get("/img/:width/:legacyWidth/*", async (req, res, next) => {
    try {
      const param = req.params[0];
      const buffer = fs.readFileSync(path.join(__dirname, "../assets", param));
      const result = await processImage(req, buffer);
      res.type("jpg");
      res.send(result);
    } catch (_) {
      next();
    }
  });

  app.get("/full-img/*", async (req, res, next) => {
    try {
      const param = req.params[0];
      const buffer = fs.readFileSync(path.join(__dirname, "../assets", param));
      const result = await processImage(req, buffer);
      res.type("jpg");
      res.send(result);
    } catch (_) {
      next();
    }
  });

  app.get("/externalImage/:width/:legacyWidth", async (req, res) => {
    const url = req.query.url as string;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const result = await processImage(req, response.data);
    res.type("jpg");
    res.send(result);
  });
}
