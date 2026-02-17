import * as http from "http";
import app from "./app";

import { PORT } from "./utils/config";
import { prisma } from "./utils/prisma";

const server = http.createServer(app);

let isShuttingDown = false;

const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    console.log("Prisma client disconnected");
  } catch (error) {
    console.error("Error disconnecting Prisma client:", error);
  }
};

const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`Received ${signal}. Closing HTTP server...`);

  server.close(async (error) => {
    if (error) {
      console.error("Error closing HTTP server:", error);
    } else {
      console.log("HTTP server closed");
    }

    await disconnectPrisma();
    process.exit(error ? 1 : 0);
  });
};

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

server.on("error", async (err) => {
  console.error("Server error:", err);
  await disconnectPrisma();
  process.exit(1);
});

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection established");

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await disconnectPrisma();
    process.exit(1);
  }
};

void start();
