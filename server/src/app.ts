import { errorHandler } from "./middleware/errorHandler";
import { unknownEndpoint } from "./middleware/unknownEndpoint";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { getHealthCheck } from "./controllers/apiController";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cors());

app.get("/", getHealthCheck);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
