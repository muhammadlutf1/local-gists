import Comment from "../db/comment.model.ts";
import type { Request, Response } from "express";
import { Prisma } from "../prisma/client.ts";

export async function addComment(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const gist = await Comment.create(Number(id), req.body);
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
