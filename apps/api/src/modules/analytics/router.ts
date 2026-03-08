import { Router } from "express";

export const analyticsRouter = Router();

analyticsRouter.get("/analytics/overview", (_req, res) => {
  res.json({
    success: true,
    data: {
      totalStudents: 24880,
      attendancePercentage: 91.8,
      defaulters: 128,
      mentorGroups: 312
    },
    meta: { requestId: crypto.randomUUID() },
    error: null
  });
});

