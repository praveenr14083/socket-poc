import express from "express";
import http from "http";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import { Server } from "socket.io";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin setup
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.database();
const devicesRef = db.ref("devices");

// In-memory cache
let devicesCache = {};

// Listen to Firebase changes
devicesRef.on("value", (snapshot) => {
  devicesCache = snapshot.val() || {};
  io.emit("devices_update", devicesCache); // broadcast to all clients
});

// Optional REST API
app.get("/devices", (req, res) => res.json(devicesCache));
app.post("/devices/:id/toggle", async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  await devicesRef.child(id).update({ state });
  res.json({ success: true });
});

// HTTP server
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send current devices on connect
  socket.emit("devices_update", devicesCache);

  // Listen for toggle from client
  socket.on("toggle_device", async ({ id }) => {
    const current = devicesCache[id];
    if (current) {
      await devicesRef.child(id).update({ state: !current.state });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
