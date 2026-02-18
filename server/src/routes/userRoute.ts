import express from "express";
import { findExistingUser } from "src/controllers/userController";

export const userRouter = express.Router();

userRouter.get("/find", findExistingUser);
