import { Request, Response, NextFunction } from "express";
import { viewPath } from "../view-path";
import { BlogData } from "../types";
import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";
import * as marked from "marked";

export function post(blogData: BlogData) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = fs
        .readFileSync(
          path.join(__dirname, "../../contents/posts", req.params[0] + ".md")
        )
        .toString("utf-8");

      const lines = post.split("\n");
      const metadata = parse(lines.slice(0, 5).join("\n"));

      const content = marked(lines.slice(5).join("\n"), {});

      res.render(viewPath(req, "post"), { ...blogData, metadata, content });
    } catch (ex) {
      console.log(ex);
      next();
    }
  };
}
