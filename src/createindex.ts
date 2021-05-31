import * as fs from "fs";
import * as path from "path";
import { PostMetadata } from "./types";
import { DateTime } from "luxon";
import * as fm from "front-matter";

async function run() {
  var normalizedPath = path.join(__dirname, "../contents/posts");

  const posts = fs.readdirSync(normalizedPath);

  const promises = posts.map(
    (post) =>
      new Promise<any>((resolve, reject) => {
        const postPath = path.join(normalizedPath, post, "post.md");
        const exists = fs.existsSync(postPath);

        if (!exists) {
          resolve(undefined);
          return;
        }

        const content = fs.readFileSync(postPath, { encoding: "utf-8" });

        // The types for this library are wrong
        /* @ts-ignore */
        const metadata = fm<TMetadata>(content);
        resolve({
          ...metadata.attributes,
          content: metadata.body,
          filename: post,
        });
      })
  );

  const results: PostMetadata[] = (await Promise.all(promises))
    .filter((o) => !!o)
    .sort((a, b) => {
      return (
        DateTime.fromFormat(b.date, "dd-MM-yyyy").toMillis() -
        DateTime.fromFormat(a.date, "dd-MM-yyyy").toMillis()
      );
    })
    .map((item) => ({
      categories: item.category.split(",").map((o: string) => o.trim()),
      tags: item.tags.split(",").map((o: string) => o.trim()),
      title: item.title,
      date: item.date,
      image: item.image,
      filename: item.filename,
      description: item.description,
    }));

  const categories: Record<string, string[]> = {};
  const tags: Record<string, string[]> = {};

  results.forEach((f) => {
    f.categories.forEach((key: string) => {
      const t = key.trim();
      let category = categories[t];
      if (!category) {
        category = [];
      }
      categories[t] = [...category, f.filename];
    });

    f.tags.forEach((key: string) => {
      const t = key.trim();
      let tag = tags[t];
      if (!tag) {
        tag = [];
      }
      tags[t] = [...tag, f.filename];
    });
  });

  fs.writeFileSync(
    path.join(__dirname, "../contents/tags.json"),
    JSON.stringify(tags)
  );
  fs.writeFileSync(
    path.join(__dirname, "../contents/categories.json"),
    JSON.stringify(categories)
  );
  fs.writeFileSync(
    path.join(__dirname, "../contents/posts.json"),
    JSON.stringify(results)
  );
}

run();
