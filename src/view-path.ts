import { Request } from "express";

export function isLegacy(req: Request) {
  const { oldie } = req.query;

  if (oldie) {
    return true;
  }

  const userAgent = req.useragent;
  if (userAgent.isIE && parseFloat(userAgent.version) < 10) {
    return true;
  }

  if (
    userAgent.browser.toLowerCase() === "netscape" ||
    userAgent.browser.toLowerCase() === "unknown"
  ) {
    return true;
  }

  return false;
}

export function viewPath(req: Request, view: string) {
  return [isLegacy(req) ? "legacy" : "modern", view].join("/");
}
