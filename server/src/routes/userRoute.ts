import express from "express";
import { createUser, findExistingUser } from "src/controllers/userController";

export const userRouter = express.Router();

userRouter.get("/find", findExistingUser);
userRouter.post("/", createUser);
