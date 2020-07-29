import { Request, Response } from "express";
import * as fs from "fs";
import * as marked from "marked";
import * as path from "path";
import { BlogData } from "../types";
import { viewPath } from "../view-path";

export function home(blogData: BlogData) {
  return async (req: Request, res: Response) => {
    const filePath = path.join(__dirname, "../../contents/intro.md");
    const content = fs.readFileSync(filePath).toString("utf-8");
    const intro = marked(content, {});
    res.render(viewPath(req, "home"), {
      ...blogData,
      showSideContent: true,
      intro,
    });
  };
}
