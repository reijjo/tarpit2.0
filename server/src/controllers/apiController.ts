import { type Request, type Response } from "express";

export const getHealthCheck = (_req: Request, res: Response) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  };

  res.status(200).send(health);
};
