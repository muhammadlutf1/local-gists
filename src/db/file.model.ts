import prisma from "../db/client.ts";
import type { FileSubmission, Gist } from "../types/index.ts";

export default {
  async createMany(id: Gist["id"], data: FileSubmission[]) {
    return prisma.gist.update({
      where: { id },
      data: {
        files: {
          createMany: {
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
};
