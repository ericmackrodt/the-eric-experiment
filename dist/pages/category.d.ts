import { Request, Response } from "express";
import { BlogData } from "../types";
export declare function category(blogData: BlogData): (req: Request, res: Response) => Promise<void>;
