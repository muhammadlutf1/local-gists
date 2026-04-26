import File from "../db/file.model.ts";
import { Prisma } from "../prisma/client.ts";
import type { Request, Response } from "express";
import type { FileSubmission } from "../types/index.ts";

export async function addFiles(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const gist = await File.createMany(Number(id), req.body);
    res.status(201).json(gist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

export async function updateFile(req: Request, res: Response) {
  const { id, filename } = req.params;

  try {
    const gist = await File.update(Number(id), filename as string, req.body);
    res.status(200).json(gist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        throw {
          status: 404,
          message: "No file found",
          errors: [
            {
              path: "/params/id",
            },
            {
              path: "/params/filename",
            },
          ],
        };
      else if (error.code === "P2002")
        throw {
          status: 409,
          message: "A file with same filename already exists",
          errors: [
            {
              path: "/body/filename",
              message: "must be unique",
            },
          ],
        };
    } else throw error;
  }
}

export async function overwriteFiles(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const gist = await File.updateAll(Number(id), req.body);
    res.status(200).json(gist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

export async function deleteFile(req: Request, res: Response) {
  const { id, filename } = req.params;

  try {
    await File.delete(Number(id), filename as FileSubmission["filename"]);
    res.status(204).end();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
