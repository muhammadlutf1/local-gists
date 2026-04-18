import e from "express";
import type { Router } from "express";

const router: Router = e.Router();

router.get("/", (_, res) => res.send("Hello World"));

export default router;
