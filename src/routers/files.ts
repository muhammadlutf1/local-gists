import e from "express";
import type { Router } from "express";
import { addFiles } from "../controllers/files.ts";

const files: Router = e.Router({ mergeParams: true });

files.post("/", addFiles);

export default files;
