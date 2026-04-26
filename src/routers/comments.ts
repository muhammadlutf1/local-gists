import e from "express";
import type { Router } from "express";
import { addComment, updateComment } from "../controllers/comments.ts";

const comments: Router = e.Router({ mergeParams: true });

comments.post("/", addComment);

comments.put("/:commentId", updateComment);

export default comments;
