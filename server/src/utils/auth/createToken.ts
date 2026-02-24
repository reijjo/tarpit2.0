import { randomBytes } from "crypto";

import { prisma } from "../prisma";

export const createToken = async (userId: number) => {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await prisma.token.create({
    data: { token, expiresAt, userId },
  });

  return token;
};
