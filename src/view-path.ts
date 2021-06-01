import { Request } from "express";

export function isOldBrowser(req: Request) {
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

export function isLegacy(req: Request) {
  const { oldie } = req.query;

  if (oldie) {
    return true;
  }

  if (req.cookies["oldie_enabled"] === "true") {
    return true;
  }

  return isOldBrowser(req);
}

export function viewPath(req: Request, view: string) {
  return [isLegacy(req) ? "legacy" : "modern", view].join("/");
}
