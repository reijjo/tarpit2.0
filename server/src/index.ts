import * as http from "http";
import app from "./app";

const server = http.createServer(app);

const start = async () => {
  try {
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

start();
