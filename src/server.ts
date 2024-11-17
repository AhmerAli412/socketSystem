import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app";
import { setupSocket } from "./services/socketService";
import dotenv from "dotenv";

dotenv.config(); 

const PORT = 3000;
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL is not defined in the environment variables");
}

const server = http.createServer(app);
const io = new Server(server);

setupSocket(io);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); 
  });
