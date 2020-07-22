import { Request, Response } from "express";
import { viewPath } from "../view-path";
import { BlogData } from "../types";

export function home(blogData: BlogData) {
  return async (req: Request, res: Response) => {
    res.render(viewPath(req, "home"), { ...blogData, showSideContent: true });
  };
}
