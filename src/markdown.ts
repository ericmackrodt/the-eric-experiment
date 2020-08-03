import { Converter } from "showdown";
import "showdown-youtube";
import "./markdown-extensions/netscape-youtube";
import "./markdown-extensions/page-layout";
import * as path from "path";
import * as fs from "fs";
import { Request } from "express";
import { isLegacy } from "./view-path";

const COMMON: string[] = [];
const EXTENSIONS = [...COMMON, "youtube", "page-layout"];
const LEGACY_EXTENSIONS = [
  ...COMMON,
  "netscape-youtube",
  "netscape-page-layout",
];

export function convertToHtml(req: Request, input: string) {
  const legacy = isLegacy(req);

  const converter = new Converter({
    extensions: legacy ? LEGACY_EXTENSIONS : EXTENSIONS,
  });
  return converter.makeHtml(input);
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
      const result = convertToHtml(req, content);
      resolve(result);
    });
  });
}
