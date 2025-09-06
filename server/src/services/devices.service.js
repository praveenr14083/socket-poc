import { db } from "../config/firebase.js";

const devicesRef = db.ref("devices");

export const getAllDevices = async () => {
  const snapshot = await devicesRef.once("value");
  return snapshot.val() || {};
};

export const toggleDevice = async (id, state) => {
  await devicesRef.child(id).update({ state });
};
