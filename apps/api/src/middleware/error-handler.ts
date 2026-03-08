import type { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    data: null,
    meta: { requestId: crypto.randomUUID() },
    error: { message: "Route not found" }
  });
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  res.status(500).json({
    success: false,
    data: null,
    meta: { requestId: crypto.randomUUID() },
    error: { message: error.message }
  });
}

