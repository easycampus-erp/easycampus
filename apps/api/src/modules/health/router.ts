import { Router } from "express";
import { ok } from "./response.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json(ok({ status: "ok", service: "easycampus-api" }));
});

