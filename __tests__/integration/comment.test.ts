import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.ts";
import prisma from "../../src/db/client.ts";

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

  it("return 404 when no gist exist with given id", async () => {
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
