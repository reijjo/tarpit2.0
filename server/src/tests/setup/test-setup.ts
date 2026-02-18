import { beforeAll, afterAll } from "bun:test";
import type { Server } from "http";

import app from "../../app";

let server: Server | undefined;
let baseUrl = "";
export { baseUrl };

beforeAll(async () => {
  await new Promise<void>((resolve, reject) => {
    const runningServer = app.listen(0);

    runningServer.once("error", reject);

    runningServer.once("listening", () => {
      const addr = runningServer.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("No test port"));
        return;
      }

      server = runningServer;
      baseUrl = `http://localhost:${addr.port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  if (!server || !server.listening) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server?.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});
