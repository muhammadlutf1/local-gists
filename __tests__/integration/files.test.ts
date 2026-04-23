import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.ts";
import prisma from "../../src/db/client.ts";

describe("POST /gists/{id}/files", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 400 when sending invalid data (Schema Validation)", async () => {
    const response = await request(app)
      .post("/gists/1/files")
      .send([{}, { filename: "test", content: "test" }]);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("return 404 when no gist exist with given id", async () => {
    const response = await request(app)
      .post("/gists/1/files")
      .send([{ filename: "test", content: "test" }]);
    expect(response.status).toBe(404);
  });

  it("creates new files and returns full gist data", async () => {
    const gist = await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          create: { filename: "initial-file" },
        },
      },
    });

    const response = await request(app)
      .post(`/gists/${gist.id}/files`)
      .send([
        { filename: "test-file1", content: "test" },
        { filename: "test-file2", content: "test2" },
      ]);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("test gist");
    expect(response.body.files).toHaveLength(3);
    expect(response.body.comments).toHaveLength(0);
    expect(response.body.files[0].filename).toBe("initial-file");
  });
});

describe("PATCH /gists/{id}/files/{filename}", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 400 when sending invalid data (Schema Validation)", async () => {
    const response = await request(app)
      .patch("/gists/1/files/test-file")
      .send({ filename: "" });
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 404 when file exists with given filename and gist id", async () => {
    const response = await request(app)
      .patch("/gists/1/files/test-file")
      .send({ filename: "test" });

    console.log(response.body);
    expect(response.status).toBe(404);
  });

  it("return 409 when a file exists with given filename", async () => {
    const gist = await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          createMany: {
            data: [
              { filename: "test-file1", content: "test" },
              { filename: "test-file2", content: "test2" },
            ],
          },
        },
      },
    });

    const response = await request(app)
      .patch(`/gists/${gist.id}/files/test-file2`)
      .send({ filename: "test-file1", content: "test" });

    expect(response.status).toBe(409);
    expect(response.body.errors).toBeDefined();
  });

  it("updates a given file of a gist", async () => {
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
      .patch(`/gists/${gist.id}/files/test-file`)
      .send({ filename: "new-test-file", content: "new content" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("test gist");
    expect(response.body.files[0].filename).toBe("new-test-file");
    expect(response.body.files[0].content).toBe("new content");
  });
});
