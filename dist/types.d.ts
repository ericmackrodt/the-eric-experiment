export declare type Tags = Record<string, string[]>;
export declare type Categories = Record<string, string[]>;
export declare type PostMetadata = {
    title: string;
    date: string;
    tags: string[];
    categories: string[];
    image: string;
    filename: string;
    description: string;
};
export declare type MainMenuItem = {
    path: string;
    lable: string;
};
export declare type BlogData = {
    tags: Tags;
    categories: Categories;
    posts: PostMetadata[];
    mainMenu: MainMenuItem[];
};
export declare type HomeModel = BlogData & {};
export declare type PageModel = {
    content: string;
};
export declare type HomeTemplate = (model: HomeModel) => string;
export declare type PageTemplate = (model: PageModel) => string;
