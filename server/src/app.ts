import { errorHandler } from "./middleware/errorHandler";
import { unknownEndpoint } from "./middleware/unknownEndpoint";
import cors from "cors";
import express, { type Request, type Response } from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from the server!");
});

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
