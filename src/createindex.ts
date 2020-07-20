import * as fs from "fs";
import * as path from "path";
import { createInterface } from "readline";
import { parse } from "yaml";

async function run() {
  var normalizedPath = path.join(__dirname, "/contents/posts");

  const posts = fs.readdirSync(normalizedPath);

  const promises = posts.map(
    (post) =>
      new Promise<any>((resolve, reject) => {
        const lineReader = createInterface({
          input: fs.createReadStream(path.join(normalizedPath, post)),
        });

        let lineCounter = 0;
        const lines: string[] = [];

        lineReader.on("line", (line) => {
          lineCounter++;
          lines.push(line);
          if (lineCounter === 5) {
            lineReader.close();
          }
        });
        lineReader.on("close", () => {
          const result = parse(lines.join("\n\r"));
          resolve({
            ...result,
            filename: path.basename(post, ".md"),
          });
        });
        lineReader.on("error", (err) => {
          reject(err);
        });
      })
  );

  const results = await Promise.all(promises);

  const categories: Record<string, string[]> = {};
  const tags: Record<string, string[]> = {};

  results.forEach((f) => {
    let cat = categories[f.category];
    if (!cat) {
      cat = [];
    }
    categories[f.category] = [...cat, f.filename];

    const ts = f.tags.split(",");
    ts.forEach((t: any) => {
      let tag = tags[t];
      if (!tag) {
        tag = [];
      }
      tags[t] = [...tag, f.filename];
    });
  });

  fs.writeFileSync(
    path.join(__dirname, "contents/tags.json"),
    JSON.stringify(tags)
  );
  fs.writeFileSync(
    path.join(__dirname, "contents/categories.json"),
    JSON.stringify(categories)
  );
  fs.writeFileSync(
    path.join(__dirname, "contents/posts.json"),
    JSON.stringify(results)
  );
}

run();
