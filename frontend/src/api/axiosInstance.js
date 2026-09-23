import axios from "axios";
import { getDeviceId } from "../utils/deviceId";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Every request carries the device id so the backend can scope history
// without a login system. Individual feature services (e.g.
// features/calculator/services/calculator.api.js) build on this instance
// rather than creating their own.
axiosInstance.interceptors.request.use((config) => {
  config.headers["x-device-id"] = getDeviceId();
  return config;
});

export default axiosInstance;
