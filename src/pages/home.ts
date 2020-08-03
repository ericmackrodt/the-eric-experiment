import { Request, Response } from "express";
import { loadFromMarkdown } from "../markdown";
import { BlogData } from "../types";
import { viewPath } from "../view-path";

export function home(blogData: BlogData) {
  return async (req: Request, res: Response) => {
    const intro = await loadFromMarkdown(
      req,
      __dirname,
      "../../contents/intro.md"
    );
    res.render(viewPath(req, "home"), {
      ...blogData,
      showSideContent: true,
      intro,
    });
  };
}
