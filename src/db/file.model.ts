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

  async update(
    id: Gist["id"],
    filename: FileSubmission["filename"],
    data: FileSubmission,
  ) {
    return prisma.gist.update({
      where: { id },
      data: {
        files: {
          update: {
            where: { gistId_filename: { gistId: id, filename: filename } },
            data: data,
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

  async updateAll(id: Gist["id"], data: FileSubmission[]) {
    return prisma.gist.update({
      where: { id },
      data: {
        files: {
          deleteMany: {},
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

  delete(id: Gist["id"], filename: FileSubmission["filename"]) {
    return prisma.file.delete({
      where: { gistId_filename: { gistId: id, filename: filename } },
    });
  },
};
