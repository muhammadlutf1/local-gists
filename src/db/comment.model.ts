import prisma from "../db/client.ts";
import type { Comment, CommentSubmission, Gist } from "../types/index.ts";

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

  update(id: Gist["id"], commentId: Comment["id"], data: CommentSubmission) {
    return prisma.gist.update({
      where: { id },
      data: {
        comments: {
          update: {
            where: { id: commentId },
            data,
          },
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

  delete(id: Gist["id"], commentId: Comment["id"]) {
    return prisma.comment.delete({ where: { id: commentId, gistId: id } });
  },
};
