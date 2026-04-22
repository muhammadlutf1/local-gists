import prisma from "../db/client.ts";
import type { GistSubmissionWithSlug } from "../types/index.ts";

export default {
  async findAll() {
    return prisma.gist.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        files: {
          take: 1,
          orderBy: [{ createdAt: "asc" }, { filename: "asc" }],
        },
        _count: {
          select: {
            files: true,
            comments: true,
          },
        },
      },
    });
  },

  async create(data: GistSubmissionWithSlug) {
    return prisma.gist.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        slug: data.slug,
        files: {
          createMany: {
            data: data.files,
          },
        },
      },
    });
  },
};
