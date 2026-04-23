import express from "express";
import { join } from "path";
import OpenApiValidator from "express-openapi-validator";
import { apiReference } from "@scalar/express-api-reference";
import gistRouter from "./routers/gists.ts";
import filesRouter from "./routers/files.ts";
import type { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

app.use(express.json());

const specPath = join(import.meta.dirname, "docs", "spec.yaml");
app.use("/docs/spec", express.static(specPath));
app.use(
  "/docs",
  apiReference({
    url: "/docs/spec",
  }),
);
app.use(
  OpenApiValidator.middleware({
    apiSpec: specPath,
    validateResponses: true,
  }),
);

// Routers
app.use("/gists", gistRouter);
app.use("/gists/:id/files", filesRouter);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // format error
  res.status(err.status ?? 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;
