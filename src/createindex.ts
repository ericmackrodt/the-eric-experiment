import * as fs from "fs";
import * as path from "path";
import { createInterface } from "readline";
import { parse } from "yaml";
import { PostMetadata } from "./types";
import { DateTime } from "luxon";

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

        const lineReader = createInterface({
          input: fs.createReadStream(postPath),
        });

        let lineCounter = 0;
        const lines: string[] = [];

        lineReader.on("line", (line) => {
          lineCounter++;
          lines.push(line);
          if (lineCounter === 6) {
            lineReader.close();
          }
        });
        lineReader.on("close", () => {
          const result = parse(lines.join("\n\r"));
          resolve({
            ...result,
            filename: post,
          });
        });
        lineReader.on("error", (err) => {
          reject(err);
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
