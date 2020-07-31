import { Converter } from "showdown";
import "showdown-youtube";
import "./markdown-extensions/netscape-youtube";
import * as path from "path";
import * as fs from "fs";
import { Request } from "express";
import { isLegacy } from "./view-path";

const EXTENSIONS = ["youtube"];
const LEGACY_EXTENSIONS = ["netscape-youtube"];

export function convertToHtml(req: Request, input: string) {
  const legacy = isLegacy(req);

  const converter = new Converter({
    extensions: legacy ? LEGACY_EXTENSIONS : EXTENSIONS,
  });
  return converter.makeHtml(input);
}

export function loadFromMarkdown(req: Request, ...pathParts: string[]) {
  const filePath = path.join(...pathParts);
  const content = fs.readFileSync(filePath).toString("utf-8");
  return convertToHtml(req, content);
}
