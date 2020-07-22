export type Tags = Record<string, string[]>;
export type Categories = Record<string, string[]>;
export type PostMetadata = {
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  image: string;
  filename: string;
  description: string;
};

export type MainMenuItem = {
  path: string;
  lable: string;
};

export type BlogData = {
  tags: Tags;
  categories: Categories;
  posts: PostMetadata[];
  mainMenu: MainMenuItem[];
};

export type HomeModel = BlogData & {};

export type PageModel = {
  content: string;
};

export type HomeTemplate = (model: HomeModel) => string;

export type PageTemplate = (model: PageModel) => string;
