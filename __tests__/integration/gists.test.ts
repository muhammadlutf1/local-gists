import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.ts";
import prisma from "../../src/db/client.ts";

describe("GET /gists", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns empty array when no gists exist", async () => {
    const response = await request(app).get("/gists");
    expect(response.body).toEqual([]);
  });

  it("returns array of all gists as GistInfo", async () => {
    await Promise.all([
      prisma.gist.create({
        data: {
          title: "Gist 1",
          slug: "gist-1",
          description: "Gist 1 description",
          files: {
            createMany: {
              data: [
                { filename: "file-1", content: "File 1 content" },
                { filename: "file-2", content: "File 2 content" },
              ],
            },
          },
          comments: {
            createMany: {
              data: [
                { content: "Comment 1 content" },
                { content: "Comment 2 content" },
                { content: "Comment 3 content" },
              ],
            },
          },
        },
      }),
      prisma.gist.create({
        data: {
          title: "Gist 2",
          slug: "gist-2",
          files: {
            create: {
              filename: "file-1",
            },
          },
        },
      }),
    ]);

    const response = await request(app).get("/gists");
    const testGist = response.body[0];

    expect(response.body).toHaveLength(2);
    expect(testGist.slug).toBe("gist-1");
    expect(testGist.files).toHaveLength(1);
    expect(testGist.files[0].filename).toBe("file-1");
    expect(testGist._count.files).toBe(2);
    expect(testGist._count.comments).toBe(3);
  });
});

describe("POST /gists", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 400 when sending invalid data (Schema Validation)", async () => {
    const response = await request(app).post("/gists").send({});
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 409 when gist with same title already exists", async () => {
    await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          create: { filename: "test-file" },
        },
      },
    });

    const response = await request(app)
      .post("/gists")
      .send({
        title: "test gist",
        files: [{ filename: "some-other-file" }],
      });

    expect(response.status).toBe(409);
  });

  it("creates and returns a new gist", async () => {
    const response = await request(app)
      .post("/gists")
      .send({
        title: "GiSt 1",
        description: "Gist 1 description",
        files: [
          { filename: "file-1", content: "File 1 content" },
          { filename: "file-2", content: "File 2 content" },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("GiSt 1");
    expect(response.body.slug).toBe("GiSt-1");
    expect(response.body.files).toHaveLength(2);
    expect(response.body.comments).toHaveLength(0);
  });
});

describe("GET /gists/{id}", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 404 when no gist exist with given id", async () => {
    const response = await request(app).get("/gists/1");
    expect(response.status).toBe(404);
  });

  it("returns the gist with the given id", async () => {
    const gist = await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          create: { filename: "test-file" },
        },
      },
    });

    const response = await request(app).get(`/gists/${gist.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("test gist");
    expect(response.body.slug).toBe("test-gist");
    expect(response.body.files).toHaveLength(1);
    expect(response.body.comments).toHaveLength(0);
  });
});

describe("PATCH /gists/{id}", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 400 when sending invalid data (Schema Validation)", async () => {
    const response = await request(app).patch("/gists/1").send({ title: "" });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 404 when no gist exist with given id", async () => {
    const response = await request(app)
      .patch("/gists/1")
      .send({ title: "test" });
    expect(response.status).toBe(404);
  });

  it("updates a given field of a gist", async () => {
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
      .patch(`/gists/${gist.id}`)
      .send({ title: "new title" });

    expect(response.body.title).toBe("new title");
    expect(response.body.slug).toBe("new-title");
    expect(response.body.files).toHaveLength(1);
    expect(response.body.comments).toHaveLength(0);
  });
});

describe("DELETE /gists/{id}", () => {
  beforeEach(async () => {
    await prisma.gist.deleteMany();
  });

  it("returns 404 when no gist exist with given id", async () => {
    const response = await request(app).delete("/gists/1");
    expect(response.status).toBe(404);
  });

  it("deletes a gist", async () => {
    const gist = await prisma.gist.create({
      data: {
        title: "test gist",
        slug: "test-gist",
        files: {
          create: { filename: "test-file" },
        },
      },
    });

    const response = await request(app).delete(`/gists/${gist.id}`);
    expect(response.status).toBe(204);
  });
});
