import { errorHandler } from "./middleware/errorHandler";
import { unknownEndpoint } from "./middleware/unknownEndpoint";
import { authRouter } from "./routes/authRoute";
import testRouter from "./routes/testRoute";
import { userRouter } from "./routes/userRoute";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { getHealthCheck } from "./controllers/apiController";

import { isProduction } from "./utils/config";

const app = express();

app.use(morgan(isProduction ? "combined" : "dev"));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", getHealthCheck);
app.use("/auth", authRouter);
app.use("/users", userRouter);

console.log("NODE_ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "test") {
  console.log("Test router registered at /test");
  app.use("/test", testRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
