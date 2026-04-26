import type { CommentSubmission, Gist } from "../types/index.ts";
import prisma from "../db/client.ts";

export default {
  create(id: Gist["id"], data: CommentSubmission) {
    return prisma.gist.update({
      where: { id },
      data: {
        comments: {
          create: data,
        },
      },
      include: {
        files: {
          orderBy: [{ createdAt: "asc" }, { filename: "asc" }],
        },
        comments: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  },
};
