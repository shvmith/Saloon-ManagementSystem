import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7001";

const client = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  async (config) => {
    // Set timeout
    config.timeout = 120000;

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    // Handle 401 unauthorized errors
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;

      // Clear token if unauthorized
      localStorage.removeItem("token");

      // Redirect to login page if unauthorized
      window.location.href = "/signin";

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default client;
