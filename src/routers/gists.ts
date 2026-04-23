import e from "express";
import type { Router } from "express";
import {
  createGist,
  getAllGists,
  getGist,
  updateGist,
  deleteGist,
} from "../controllers/gists.ts";

const gists: Router = e.Router();

gists.get("/", getAllGists);

gists.post("/", createGist);

gists.get("/:id", getGist);

gists.patch("/:id", updateGist);

gists.delete("/:id", deleteGist);

export default gists;
