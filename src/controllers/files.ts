import File from "../db/file.model.ts";
import { Prisma } from "../prisma/client.ts";
import type { Request, Response } from "express";

export async function addFiles(req: Request, res: Response) {
  const { id } = req.params;

  try {
    console.log(id);
    const gist = await File.createMany(Number(id), req.body);
    res.status(201).json(gist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
