import { extension, Converter } from "showdown";
import * as path from "path";
import * as fs from "fs";
import { Gallery } from "../types";

extension("gallery", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const GALLERY_REGEX = /\[gallery[\s]+"(.+)"\]/gm;

        return text.replace(GALLERY_REGEX, function(_, injectPath) {
          const filePath = converter.getOption("filePath");
          const finalPath = path.join(filePath, "../..", injectPath);
          const file = fs.readFileSync(finalPath).toString("utf-8");
          const gallery: Gallery = JSON.parse(file);

          return [
            '<div class="gallery-container"><gallery><ul>',
            gallery.items
              .map((item) => `<li><img src="${item}"/></li>`)
              .join(""),
            "</ul></gallery></div>",
          ].join("");
        });
      },
    },
  ];
});

extension("legacy-gallery", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const GALLERY_REGEX = /\[gallery[\s]+"(.+)"\]/gm;

        return text.replace(GALLERY_REGEX, function(_, injectPath) {
          const filePath = converter.getOption("filePath");
          const finalPath = path.join(filePath, "../..", injectPath);
          const file = fs.readFileSync(finalPath).toString("utf-8");
          const gallery: Gallery = JSON.parse(file);
          return [
            "<p>",
            gallery.items
              .map(
                (item, index) =>
                  `<a href="/gallery/${index}${injectPath.replace(
                    ".json",
                    ""
                  )}"><img src="/img/120/90${item}" border="0"><img src="/assets/nothing.gif" width="5" height="90" border="0">`
              )
              .join(""),
            "</p>",
          ].join("");
        });
      },
    },
  ];
});
