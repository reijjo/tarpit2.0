import express from "express";
import { createUser, findExistingUser } from "src/controllers/authController";

export const authRouter = express.Router();

authRouter.get("/available", findExistingUser);
authRouter.post("/register", createUser);
