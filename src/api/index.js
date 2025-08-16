import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const BACKEND_URL = isLocalhost
  ? "http://localhost:3000"
  : "https://nutrikids-v2-production-e9a1.up.railway.app";

const ML_URL = isLocalhost
  ? "http://localhost:8000"
  : "https://nutrikids-v2-production-c97c.up.railway.app";

export const ApiBackend = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

ApiBackend.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const ApiMl = axios.create({
  baseURL: ML_URL,
});
