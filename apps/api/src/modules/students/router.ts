import { Router } from "express";

export const studentsRouter = Router();

studentsRouter.get("/students", (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: "stu-1", name: "Aarav Mehta", attendance: 93, currentSemester: 5 },
      { id: "stu-2", name: "Diya Rao", attendance: 88, currentSemester: 3 }
    ],
    meta: { requestId: crypto.randomUUID() },
    error: null
  });
});

