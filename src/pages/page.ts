import { NextFunction, Request, Response } from "express";
import { loadFromMarkdown } from "../markdown";
import { BlogData } from "../types";
import { viewPath } from "../view-path";

export function page(blogData: BlogData) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urlPath = req.params[0];
      const content = loadFromMarkdown(
        req,
        __dirname,
        "../../contents/pages",
        urlPath + ".md"
      );
      res.render(viewPath(req, "page"), {
        ...blogData,
        content,
        showSideContent: false,
      });
    } catch (_) {
      next();
    }
  };
}
