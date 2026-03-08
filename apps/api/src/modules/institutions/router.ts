import { Router } from "express";

export const institutionsRouter = Router();

institutionsRouter.get("/institutions/:institutionId", (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.institutionId,
      name: "EasyCampus Demo University",
      type: "university",
      timezone: "Asia/Kolkata"
    },
    meta: { requestId: crypto.randomUUID() },
    error: null
  });
});

