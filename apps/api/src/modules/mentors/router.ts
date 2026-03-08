import { Router } from "express";

export const mentorsRouter = Router();

mentorsRouter.get("/mentors", (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: "men-1", name: "Prof. Kavya Sharma", assignedStudents: 42 },
      { id: "men-2", name: "Dr. Rohit Verma", assignedStudents: 38 }
    ],
    meta: { requestId: crypto.randomUUID() },
    error: null
  });
});

