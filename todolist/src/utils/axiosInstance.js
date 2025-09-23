import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // backend server
  withCredentials: true, // allow cookies if you ever switch to cookie storage
});

// 🔑 Add Authorization header with JWT token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
