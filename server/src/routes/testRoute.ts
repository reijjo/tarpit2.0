import { Router, type Request, type Response } from "express";

import { prisma } from "src/utils/prisma";

const testRouter = Router();

testRouter.delete("/reset", async (_req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "test") {
    return res.status(403).json({ error: "Forbidden!" });
  }

  await prisma.user.deleteMany();
  res.status(200).json({ success: true, message: "Test users deleted." });
});

export default testRouter;
