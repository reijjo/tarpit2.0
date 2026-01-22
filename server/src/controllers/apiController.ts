import { type Request, type Response } from "express";

export const getHealthCheck = (_req: Request, res: Response) => {
  res.send("Hello from the server!");
};
