import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import setupDeviceSockets from "./sockets/devices.socket.js";
import { PORT } from "./config/index.js";

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket"], // Force WebSocket
});

// Setup Socket.IO handlers
setupDeviceSockets(io);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
