"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var body_parser_1 = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var session = require("express-session");
var useragent = require("express-useragent");
var fs = require("fs");
var path = require("path");
var sharp = require("sharp");
var ua = require("universal-analytics");
var category_1 = require("./pages/category");
var home_1 = require("./pages/home");
var page_1 = require("./pages/page");
var post_1 = require("./pages/post");
var tag_1 = require("./pages/tag");
var tags = require("../contents/tags.json");
var categories = require("../contents/categories.json");
var posts = require("../contents/posts.json");
var mainMenu = require("../contents/main-menu.json");
var app = express();
var port = process.env.PORT || 3001;
app.set("view engine", "vash");
app.use("/assets", express.static("assets"));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(useragent.express());
app.use(session({
    secret: "oldstuff",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
}));
app.use(ua.middleware("blah", { cookieName: "_ga" }));
app.use(body_parser_1.urlencoded({ extended: true }));
function processImage(req, data) {
    return __awaiter(this, void 0, void 0, function () {
        var fit, width, height;
        return __generator(this, function (_a) {
            fit = req.query.fit;
            width = parseInt(req.params.width);
            height = parseInt(req.params.height);
            return [2, sharp(data)
                    .resize(width, height, {
                    fit: fit,
                })
                    .jpeg({
                    quality: 50,
                    chromaSubsampling: "4:4:4",
                })
                    .toBuffer()];
        });
    });
}
app.get("/post/asset/:width/:height/:id/*", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var param, buffer, result, _1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                param = req.params[0];
                buffer = fs.readFileSync(path.join(__dirname, "../contents/posts", req.params.id, param));
                return [4, processImage(req, buffer)];
            case 1:
                result = _a.sent();
                res.type("jpg");
                res.send(result);
                return [3, 3];
            case 2:
                _1 = _a.sent();
                next();
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
app.get("/img/:width/:height/*", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var param, buffer, result, _2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                param = req.params[0];
                buffer = fs.readFileSync(path.join(__dirname, "../assets", param));
                return [4, processImage(req, buffer)];
            case 1:
                result = _a.sent();
                res.type("jpg");
                res.send(result);
                return [3, 3];
            case 2:
                _2 = _a.sent();
                next();
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
app.get("/externalImage/:width/:height", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, response, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = req.query.url;
                return [4, axios_1.default.get(url, { responseType: "arraybuffer" })];
            case 1:
                response = _a.sent();
                return [4, processImage(req, response.data)];
            case 2:
                result = _a.sent();
                res.type("jpg");
                res.send(result);
                return [2];
        }
    });
}); });
app.get("/", home_1.home({ tags: tags, categories: categories, posts: posts, mainMenu: mainMenu }));
app.get("/category", category_1.category({ tags: tags, categories: categories, posts: posts, mainMenu: mainMenu }));
app.get("/tag", tag_1.tag({ tags: tags, categories: categories, posts: posts, mainMenu: mainMenu }));
app.get("/post/:id", post_1.post({ tags: tags, categories: categories, posts: posts, mainMenu: mainMenu }));
app.get("/*", page_1.page({ tags: tags, categories: categories, posts: posts, mainMenu: mainMenu }));
app.listen(port, function () {
    return console.log("Example app listening at http://localhost:" + port);
});
//# sourceMappingURL=server.js.map