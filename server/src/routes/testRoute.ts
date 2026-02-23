import { Router, type Request, type Response } from "express";

import { prisma } from "src/utils/prisma";

const testRouter = Router();

testRouter.delete(
  "/reset",
  async (_req: Request, res: Response): Promise<void> => {
    if (process.env.NODE_ENV !== "test") {
      res.status(403).json({ error: "Forbidden!" });
      return;
    }
    try {
      await prisma.user.deleteMany();
      res.status(200).json({ success: true, message: "Test users deleted." });
    } catch (error) {
      console.error("Test reset failed:", error);
      res.status(500).json({ error: "Failed to reset test data." });
    }
  },
);

export default testRouter;
