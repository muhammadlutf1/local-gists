import Gist from "../db/gist.model.ts";
import slugify from "slugify";
import { Prisma } from "../prisma/client.ts";
import type { Request, Response } from "express";
import type { GistSubmission } from "../types/index.ts";

export async function getAllGists(req: Request, res: Response) {
  const gists = await Gist.findAll();

  res.status(200).json(gists);
}

export async function createGist(req: Request, res: Response) {
  const data: GistSubmission = req.body;
  const slug = slugify(req.body.title);

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
    }
  }
}
