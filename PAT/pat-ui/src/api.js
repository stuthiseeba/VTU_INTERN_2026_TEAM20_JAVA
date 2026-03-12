import axios from "axios";


export const api = axios.create({
  baseURL: ""
});

// Automatically attach JWT token to every request if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});