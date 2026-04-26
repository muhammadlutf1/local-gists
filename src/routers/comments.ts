import e from "express";
import type { Router } from "express";
import { addComment } from "../controllers/comments.ts";

const comments: Router = e.Router({ mergeParams: true });

comments.post("/", addComment);

export default comments;
