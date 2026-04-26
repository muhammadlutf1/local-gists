import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.ts";
import prisma from "../../src/db/client.ts";
import type { Comment } from "../../src/types/index.ts";

describe("POST /gists/{id}/comments", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 400 when sending invalid data (Schema Validation)", async () => {
    const response = await request(app)
      .post("/gists/1/comments")
      .send({ content: "" });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 404 when no comment exists with given comment id and gist id", async () => {
    const response = await request(app)
      .post("/gists/1/comments")
      .send({ content: "test" });
    expect(response.status).toBe(404);
  });

  it("creates new comment and returns full gist data", async () => {
    const gist = await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          create: { filename: "test-file" },
        },
      },
    });

    const response = await request(app)
      .post(`/gists/${gist.id}/comments`)
      .send({ content: "test" });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("test gist");
    expect(response.body.files).toHaveLength(1);
    expect(response.body.comments).toHaveLength(1);
    expect(response.body.comments[0].content).toBe("test");
  });
});

describe("PUT /gists/{id}/comments/{commentId}", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 400 when sending invalid data (Schema Validation)", async () => {
    const response = await request(app)
      .put("/gists/1/comments/1")
      .send({ content: "" });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 404 when no comment exists with given comment id and gist id", async () => {
    const response = await request(app)
      .put("/gists/1/comments/1")
      .send({ content: "test" });
    expect(response.status).toBe(404);
  });

  it("updates a comment of a gist", async () => {
    const gist = await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          create: { filename: "test-file" },
        },
        comments: {
          createMany: {
            data: [
              { content: "old content" },
              { content: "some other content" },
            ],
          },
        },
      },
      include: {
        comments: true,
      },
    });

    const commentId = gist.comments.find(
      (c) => c.content === "old content",
    )!.id;

    const response = await request(app)
      .put(`/gists/${gist.id}/comments/${commentId}`)
      .send({ content: "new content" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("test gist");
    expect(
      response.body.comments.find((c: Comment) => c.id === commentId).content,
    ).toBe("new content");
  });
});

describe("DELETE /gists/{id}/comments/{commentId}", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 404 when no comment exists with given comment id and gist id", async () => {
    const response = await request(app).delete("/gists/1/comments/1");
    expect(response.status).toBe(404);
  });

  it("deletes a comment", async () => {
    const gist = await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          create: { filename: "test-file" },
        },
        comments: {
          createMany: {
            data: [
              { content: "old content" },
              { content: "some other content" },
            ],
          },
        },
      },
      include: {
        comments: true,
      },
    });

    const commentId = gist.comments.find(
      (c) => c.content === "old content",
    )!.id;

    const response = await request(app).delete(
      `/gists/${gist.id}/comments/${commentId}`,
    );

    expect(response.status).toBe(204);
  });
});
