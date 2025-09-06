import express from "express";
import { getAllDevices, toggleDevice } from "../services/devices.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const devices = await getAllDevices();
  res.json(devices);
});

router.post("/:id/toggle", async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  await toggleDevice(id, state);
  res.json({ success: true });
});

export default router;
