import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "/api", // works with dev proxy; or set VITE_API_BASE
  timeout: 10000,
});