import e from "express";
import type { Router } from "express";
import { addFiles, overwriteFiles, updateFile } from "../controllers/files.ts";

const files: Router = e.Router({ mergeParams: true });

files.post("/", addFiles);

files.put("/", overwriteFiles);

files.patch("/:filename", updateFile);

export default files;
