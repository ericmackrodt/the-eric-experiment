import { Converter } from "showdown";
import "./markdown-extensions/showdown-youtube";
import "./markdown-extensions/netscape-youtube";
import "./markdown-extensions/page-layout";
import "./markdown-extensions/gallery";
import "./markdown-extensions/inject-md";
import "./markdown-extensions/page-menu";
import "./markdown-extensions/image-wrap";
import "./markdown-extensions/file-download";
import "./markdown-extensions/legacy-headers";
import * as path from "path";
import * as fs from "fs";
import { Request } from "express";
import { isLegacy } from "./view-path";

const COMMON: string[] = ["inject-md"];
const EXTENSIONS = [
  ...COMMON,
  "youtube",
  "page-layout",
  "gallery",
  "image-wrap",
  "page-menu",
  "file-download",
];
const LEGACY_EXTENSIONS = [
  ...COMMON,
  "netscape-youtube",
  "netscape-page-layout",
  "legacy-headers",
  "netscape-page-menu",
  "legacy-gallery",
  "legacy-file-download",
];

export function convertToHtml(req: Request, filePath: string, input: string) {
  const legacy = isLegacy(req);

  const converter = new Converter({
    extensions: legacy ? LEGACY_EXTENSIONS : EXTENSIONS,
    filePath,
  });
  let output = converter.makeHtml(input);
  // remove empty paragraphs
  let match: RegExpExecArray;
  const pRegex = /<p>\s*<\/p>/gm;
  while ((match = pRegex.exec(output))) {
    output = output.replace(match[0], "");
  }
  return output;
}

export function loadFromMarkdown(
  req: Request,
  ...pathParts: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(...pathParts);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const content = data.toString("utf-8");
      const folder = path.dirname(filePath);
      const result = convertToHtml(req, folder, content);
      resolve(result);
    });
  });
}
