import { Request, Response, NextFunction } from "express";
import { BlogData } from "../types";
export declare function page(blogData: BlogData): (req: Request, res: Response, next: NextFunction) => Promise<void>;
