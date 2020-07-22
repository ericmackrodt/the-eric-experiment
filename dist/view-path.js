"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewPath = void 0;
function viewPath(req, view) {
    var userAgent = req.useragent;
    if (userAgent.isIE && parseFloat(userAgent.version) < 10) {
        return ["legacy", view].join("/");
    }
    if (userAgent.browser.toLowerCase() === "netscape") {
        return ["legacy", view].join("/");
    }
    return ["modern", view].join("/");
}
exports.viewPath = viewPath;
//# sourceMappingURL=view-path.js.map