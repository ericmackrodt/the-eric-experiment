import { urlencoded } from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import { Request, Response } from "express";
import * as session from "express-session";
import * as useragent from "express-useragent";
import got from "got";
import { images } from "./images";
import { category } from "./pages/category";
import { gallery } from "./pages/gallery";
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
const port = process.env.PORT ? parseInt(process.env.PORT) : 3003;

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

app.use(urlencoded({ extended: true }));

function shouldCompress(req: Request, res: Response) {
  if (isLegacy(req)) {
    return false;
  }

  return compression.filter(req, res);
}

app.use(compression({ filter: shouldCompress }));

// function ensureSecure(req: Request, res: Response, next: express.NextFunction) {
//   console.log("ensure secure");
//   if (req.secure || isLegacy(req) || req.hostname === "localhost") {
//     console.log("yeah na");
//     // OK, continue
//     return next();
//   }

//   console.log(req.originalUrl);
//   console.log(req.url);

//   console.log("https://" + req.hostname + req.url);
//   // handle port numbers if you need non defaults
//   // res.redirect('https://' + req.host + req.url); // express 3.x
//   res.redirect("https://" + req.hostname + req.url); // express 4.x
// }

// app.all("*", ensureSecure); // at top of routing calls

app.set("view engine", "vash");

app.use("/assets", express.static("assets"));

images(app);

app.get("/download/:id", async (req, res) => {
  const downloadId = req.params.id;
  const downloadUrl = `https://drive.google.com/u/0/uc?id=${downloadId}&export=download&confirm=hHM7`;
  got.stream(downloadUrl).pipe(res);
});

app.get("/", home({ tags, categories, posts, mainMenu }));
app.get("/category", category({ tags, categories, posts, mainMenu }));
app.get("/tag", tag({ tags, categories, posts, mainMenu }));
app.get("/post/:id", post({ tags, categories, posts, mainMenu }));
app.get("/gallery/:index/*", gallery({ tags, categories, posts, mainMenu }));
app.get("/*", page({ tags, categories, posts, mainMenu }));

app.listen(port, "0.0.0.0", 0, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
