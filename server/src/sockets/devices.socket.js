import { getAllDevices, toggleDevice } from "../services/devices.service.js";

export default function setupDeviceSockets(io) {
  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    // Send current devices
    const devices = await getAllDevices();
    socket.emit("devices_update", devices);

    socket.on("toggle_device", async ({ id }) => {
      const current = (await getAllDevices())[id];
      if (current) await toggleDevice(id, !current.state);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
