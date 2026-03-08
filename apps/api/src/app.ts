import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { analyticsRouter } from "./modules/analytics/router.js";
import { authRouter } from "./modules/auth/router.js";
import { healthRouter } from "./modules/health/router.js";
import { institutionsRouter } from "./modules/institutions/router.js";
import { mentorsRouter } from "./modules/mentors/router.js";
import { studentsRouter } from "./modules/students/router.js";

export const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ service: "easycampus-api", version: "0.1.0" });
});

app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", institutionsRouter);
app.use("/api/v1", studentsRouter);
app.use("/api/v1", mentorsRouter);
app.use("/api/v1", analyticsRouter);

app.use(notFound);
app.use(errorHandler);

