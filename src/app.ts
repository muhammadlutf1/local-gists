import express from "express";
import { join } from "path";
import OpenApiValidator from "express-openapi-validator";
import type { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

app.use(express.json());
app.use(
  OpenApiValidator.middleware({
    apiSpec: join(import.meta.dirname, "docs", "spec.yaml"),
  }),
);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // format error
  res.status(err.status ?? 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;
