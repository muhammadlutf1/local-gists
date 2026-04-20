import e from "express";
import type { Router } from "express";
import { createGist, getAllGists } from "../controllers/gists.ts";

const gists: Router = e.Router();

gists.get("/", getAllGists);

gists.post("/", createGist);

export default gists;
