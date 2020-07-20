import { Request } from "express";

export function viewPath(req: Request, view: string) {
  const userAgent = req.useragent;
  if (userAgent.isIE && parseFloat(userAgent.version) < 10) {
    return ["legacy", view].join("/");
  }

  if (userAgent.browser.toLowerCase() === "netscape") {
    return ["legacy", view].join("/");
  }

  return ["legacy", view].join("/");
}
