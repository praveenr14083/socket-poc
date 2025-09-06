import express from "express";
import devicesRoutes from "./devices.routes.js";

const router = express.Router();

router.use("/devices", devicesRoutes);

export default router;
