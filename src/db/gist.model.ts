import prisma from "../db/client.ts";
import type {
  Gist,
  GistSubmissionWithSlug,
  GistInfoUpdate,
} from "../types/index.ts";

export default {
  async findAll() {
    return prisma.gist.findMany({
      include: {
        files: {
          take: 1,
          orderBy: [{ createdAt: "asc" }, { filename: "asc" }],
        },
        comments: {
          orderBy: {
            createdAt: "asc",
          },
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

  async update(id: Gist["id"], data: GistInfoUpdate) {
    return prisma.gist.update({
      where: { id },
      data,
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

  async delete(id: Gist["id"]) {
    return prisma.gist.delete({ where: { id } });
  },
};
