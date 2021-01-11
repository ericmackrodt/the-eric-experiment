import { extension, Converter } from "showdown";
import * as path from "path";
import * as fs from "fs";

function showdownEscapes(text: string) {
  text = text.replace(/¨/g, "¨T");

  // Replace $ with ¨D
  // RegExp interprets $ as a special character
  // when it's in a replacement string
  text = text.replace(/\$/g, "¨D");

  // Standardize line endings
  text = text.replace(/\r\n/g, "\n"); // DOS to Unix
  text = text.replace(/\r/g, "\n"); // Mac to Unix

  // Stardardize line spaces
  text = text.replace(/\u00A0/g, "&nbsp;");

  return text;
}

extension("wrap-with", function() {
  return [
    {
      type: "lang",
      filter(text: string, converter: Converter) {
        const GALLERY_REGEX = /\[wrap-with[\s]+"(.+)"\]/gm;

        let match: RegExpExecArray;
        let output = text;

        while ((match = GALLERY_REGEX.exec(output))) {
          output = output.replace(match[0], "");
          const wrapPath = match[1];
          const filePath = converter.getOption("filePath");
          const finalPath = path.join(filePath, wrapPath);
          const imported = showdownEscapes(
            fs.readFileSync(finalPath).toString("utf-8")
          );

          output = imported.replace(/\[inject-here\]/gm, output);

          output = converter.makeHtml(output);
        }

        return output;
      },
    },
  ];
});
