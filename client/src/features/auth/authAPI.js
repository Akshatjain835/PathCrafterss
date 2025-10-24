import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, // send cookies
});

export const register = (payload) => api.post("/api/auth/register", payload);
export const login = (payload) => api.post("/api/auth/login", payload);
export const logout = () => api.post("/api/auth/logout");
export const me = () => api.get("/api/auth/me");
export const getProfile = () => api.get("/api/auth/getProfile");
export const updateProfile = (editData) => api.post("/api/auth/updateProfile", editData);

export default api;
