import { Request, Response, NextFunction } from "express";
import { viewPath } from "../view-path";
import { BlogData, PostMetadata } from "../types";
import * as fs from "fs";
import * as path from "path";
import { convertToHtml } from "../markdown";
import * as fm from "front-matter";

export function post(blogData: BlogData) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dirname = path.join(
        __dirname,
        "../../contents/posts",
        req.params.id
      );

      const post = fs
        .readFileSync(path.join(dirname, "post.md"))
        .toString("utf-8");

      // The types for this library are wrong
      /* @ts-ignore */
      const { attributes, body } = fm<TMetadata>(post);

      const metadata: PostMetadata = {
        categories: attributes.category.split(",").map((o: string) => o.trim()),
        tags: attributes.tags.split(",").map((o: string) => o.trim()),
        title: attributes.title,
        date: attributes.date,
        image: attributes.image,
        filename: req.params.id,
        description: attributes.description,
      };

      const content = convertToHtml(req, dirname, body);

      res.render(viewPath(req, "post"), {
        ...blogData,
        metadata,
        content,
        showSideContent: true,
      });
    } catch (ex) {
      next();
    }
  };
}
