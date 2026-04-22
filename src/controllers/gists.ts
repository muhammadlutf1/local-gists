import Gist from "../db/gist.model.ts";
import slugify from "slugify";
import { Prisma } from "../prisma/client.ts";
import type { Request, Response } from "express";
import type { GistSubmission, GistInfoUpdate } from "../types/index.ts";

export async function getAllGists(req: Request, res: Response) {
  const gists = await Gist.findAll();

  res.status(200).json(gists);
}

export async function createGist(req: Request, res: Response) {
  const data: GistSubmission = req.body;
  const slug = slugify(req.body.title);

  if (data.title.trim().length === 0)
    throw {
      status: 400,
      message: "title can't be empty spaces",
      errors: [{ path: "/body/title", message: "can't be empty spaces" }],
    };

  try {
    const gist = await Gist.create({ ...data, slug });
    res.status(201).json(gist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        throw {
          status: 409,
          message: "A Gist with same title already exists",
          errors: [
            {
              path: "/body/title",
              message: "must be unique",
            },
          ],
        };
    } else throw error;
  }
}

export async function getGist(req: Request, res: Response) {
  const { id } = req.params;
  const gist = await Gist.findOne(Number(id));
  if (!gist)
    throw {
      status: 404,
      message: "Gist not found",
      errors: [
        {
          path: "/params/id",
          message: "No gist found with given id",
        },
      ],
    };
  res.status(200).json(gist);
}

export async function updateGist(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description } = req.body;

  const update: GistInfoUpdate = {};
  if (title) {
    const slug = slugify(title);
    update.slug = slug;
    update.title = title;
  }
  if (description) update.description = description;

  try {
    const gist = await Gist.update(Number(id), update);
    res.status(200).json(gist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code);
      if (error.code === "P2025")
        throw {
          status: 404,
          message: "Gist not found",
          errors: [
            {
              path: "/params/id",
              message: "No gist found with given id",
            },
          ],
        };
    } else throw error;
  }
}
