import { Router } from "express";

export const authRouter = Router();

authRouter.post("/login", (_req, res) => {
  res.json({
    success: true,
    data: {
      token: "demo-token",
      user: {
        id: "demo-admin",
        role: "admin",
        email: "admin@easycampus.local"
      }
    },
    meta: { requestId: crypto.randomUUID() },
    error: null
  });
});

