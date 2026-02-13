import { beforeAll, afterAll } from "bun:test";
import type { Server } from "http";
import app from "../../app";

let server: Server;
let baseUrl = "";
export { baseUrl };

beforeAll((done) => {
  server = app.listen(0, () => {
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("No test port");
    baseUrl = `http://localhost:${addr.port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});
