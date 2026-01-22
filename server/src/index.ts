import app from "./app";
import * as http from "http";

import { PORT } from "./utils/config";

const server = http.createServer(app);

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Closing HTTP server...`);

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

const start = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
    process.exit(1);
  }
};

start();
