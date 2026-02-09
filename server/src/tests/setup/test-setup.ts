import { beforeAll, afterAll } from "bun:test";
import type { Server } from "http";

import app from "../../app";

let server: Server;
export const PORT = 3002;
export const baseUrl = `http://localhost:${PORT}`;

beforeAll((done) => {
  server = app.listen(PORT, done);
});

afterAll((done) => {
  server.close(done);
});
