import axios from "axios";
import { urlencoded } from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import { Request, Response } from "express";
import * as session from "express-session";
import * as useragent from "express-useragent";
import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
import * as ua from "universal-analytics";
import { category } from "./pages/category";
import { home } from "./pages/home";
import { page } from "./pages/page";
import { post } from "./pages/post";
import { tag } from "./pages/tag";
import { Categories, MainMenuItem, PostMetadata, Tags } from "./types";
import { isLegacy } from "./view-path";

const tags: Tags = require("../contents/tags.json");
const categories: Categories = require("../contents/categories.json");
const posts: PostMetadata[] = require("../contents/posts.json");
const mainMenu: MainMenuItem[] = require("../contents/main-menu.json");

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.set("trust proxy", 1); // trust first proxy
app.use(useragent.express());
app.use(
  session({
    secret: "oldstuff",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);

app.use(ua.middleware("blah", { cookieName: "_ga" }));

app.use(urlencoded({ extended: true }));

function shouldCompress(req: Request, res: Response) {
  if (isLegacy(req)) {
    return false;
  }

  return compression.filter(req, res);
}

app.use(compression({ filter: shouldCompress }));

app.set("view engine", "vash");

app.use("/assets", express.static("assets"));

async function processImage(req: Request, data: Buffer) {
  const fit = req.query.fit as
    | "fill"
    | "contain"
    | "cover"
    | "inside"
    | "outside";
  const width = parseInt(req.params.width);
  const height = parseInt(req.params.height);
  return sharp(data)
    .resize(width, height, {
      fit,
    })
    .jpeg({
      quality: 50,
      chromaSubsampling: "4:4:4",
    })
    .toBuffer();
}

app.get("/post/asset/:width/:height/:id/*", async (req, res, next) => {
  try {
    const param = req.params[0];
    const buffer = fs.readFileSync(
      path.join(__dirname, "../contents/posts", req.params.id, param)
    );
    const result = await processImage(req, buffer);
    res.type("jpg");
    res.send(result);
  } catch (_) {
    next();
  }
});

app.get("/img/:width/:height/*", async (req, res, next) => {
  try {
    const param = req.params[0];
    const buffer = fs.readFileSync(path.join(__dirname, "../assets", param));
    const result = await processImage(req, buffer);
    res.type("jpg");
    res.send(result);
  } catch (_) {
    next();
  }
});

app.get("/externalImage/:width/:height", async (req, res) => {
  const url = req.query.url as string;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const result = await processImage(req, response.data);
  res.type("jpg");
  res.send(result);
});

app.get("/", home({ tags, categories, posts, mainMenu }));
app.get("/category", category({ tags, categories, posts, mainMenu }));
app.get("/tag", tag({ tags, categories, posts, mainMenu }));
app.get("/post/:id", post({ tags, categories, posts, mainMenu }));
app.get("/*", page({ tags, categories, posts, mainMenu }));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
