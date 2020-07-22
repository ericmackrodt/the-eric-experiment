import { Request, Response, NextFunction } from "express";
import { viewPath } from "../view-path";
import { BlogData, PostMetadata } from "../types";
import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";
import * as marked from "marked";

export function post(blogData: BlogData) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = fs
        .readFileSync(
          path.join(__dirname, "../../contents/posts", req.params.id, "post.md")
        )
        .toString("utf-8");

      const lines = post.split("\n");
      const meta = parse(lines.slice(0, 6).join("\n"));
      const metadata: PostMetadata = {
        categories: meta.category.split(",").map((o: string) => o.trim()),
        tags: meta.tags.split(",").map((o: string) => o.trim()),
        title: meta.title,
        date: meta.date,
        image: meta.image,
        filename: req.params.id,
        description: meta.description,
      };

      console.log(metadata);
      const content = marked(lines.slice(5).join("\n"), {});

      res.render(viewPath(req, "post"), {
        ...blogData,
        metadata,
        content,
        showSideContent: true,
      });
    } catch (ex) {
      console.log(ex);
      next();
    }
  };
}
