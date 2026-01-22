import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from the server!");
});

export default app;
