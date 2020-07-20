import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as marked from "marked";
import * as path from "path";
import { viewPath } from "../view-path";

export async function page(req: Request, res: Response, next: NextFunction) {
  try {
    const urlPath = req.params[0];
    const filePath = path.join(
      __dirname,
      "../../contents/pages",
      urlPath + ".md"
    );
    const content = fs.readFileSync(filePath).toString("utf-8");
    const markdown = marked(content, {});
    res.render(viewPath(req, "page"), {
      content: markdown,
    });
  } catch (_) {
    next();
  }
}
