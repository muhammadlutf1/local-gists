import e from "express";
import type { Router } from "express";
import {
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/comments.ts";

const comments: Router = e.Router({ mergeParams: true });

comments.post("/", addComment);

comments.put("/:commentId", updateComment);

comments.delete("/:commentId", deleteComment);

export default comments;
