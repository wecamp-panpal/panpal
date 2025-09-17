import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;