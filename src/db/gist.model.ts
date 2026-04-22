import prisma from "../db/client.ts";
import type {
  Gist,
  GistSubmissionWithSlug,
  GistInfoUpdate,
} from "../types/index.ts";

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
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async findOne(id: Gist["id"]) {
    return prisma.gist.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        files: true,
        comments: true,
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
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        files: true,
        comments: true,
      },
    });
  },

  async update(id: Gist["id"], data: GistInfoUpdate) {
    return prisma.gist.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        files: true,
        comments: true,
      },
    });
  },
};
