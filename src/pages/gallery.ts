import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { BlogData, Gallery } from "../types";

export function gallery(blogData: BlogData) {
  return async (req: Request, res: Response) => {
    const galleryPath = req.params[0] + ".json";
    const index = parseInt(req.params.index);
    const filePath = path.join(__dirname, "../..", galleryPath);
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    const gallery: Gallery = JSON.parse(content);
    const currentPhoto = gallery.items[index];

    const previousImageIndex = index - 1;
    const nextImageIndex = index + 1;

    const hasPreviousImage = !!gallery.items[previousImageIndex];
    const hasNextImage = !!gallery.items[nextImageIndex];

    const previousImage =
      "/gallery/" + previousImageIndex + "/" + req.params[0];
    const nextImage = "/gallery/" + nextImageIndex + "/" + req.params[0];

    res.render("legacy/gallery", {
      ...blogData,
      gallery,
      currentPhoto,
      previousImage,
      nextImage,
      hasPreviousImage,
      hasNextImage,
    });
  };
}
