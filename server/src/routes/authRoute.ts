import express from "express";
import {
  createUser,
  findExistingUser,
  verifyUser,
} from "src/controllers/authController";

export const authRouter = express.Router();

authRouter.get("/available", findExistingUser);
authRouter.post("/register", createUser);
authRouter.get("/verify", verifyUser);
