import { Request, Response } from "express";
import { viewPath } from "../view-path";
import { BlogData } from "../types";

export function category(blogData: BlogData) {
  return async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const postIds = blogData.categories[id];
    const posts = blogData.posts.filter((p) => postIds.includes(p.filename));
    res.render(viewPath(req, "posts"), {
      ...blogData,
      posts,
      title: "Category: " + id,
      showSideContent: true,
    });
  };
}
