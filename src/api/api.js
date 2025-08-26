import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

// Attach JWT token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.getCurrentUser = async () => {
    try {
      const res = await API.get("/auth/me");
      return res.data;
    } catch {
      return null;
    }
  };
  
export default API;
