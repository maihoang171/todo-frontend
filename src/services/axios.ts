import axios from "axios";

export const axiosClient = axios.create({
  timeout: 60000,
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
});
