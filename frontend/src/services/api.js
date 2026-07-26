import axios from "axios";

const AUTH_URL = "http://localhost:8081";
const FINANCE_URL = "http://localhost:8082";
const CHAT_URL = "http://localhost:8083";

export const authAPI = axios.create({
  baseURL: AUTH_URL,
});

export const financeAPI = axios.create({
  baseURL: FINANCE_URL,
});

export const chatAPI = axios.create({
  baseURL: CHAT_URL,
});

const addAuthHeader = (config) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (user.token) {
    config.headers["Authorization"] = `Bearer ${user.token}`;
  }
  return config;
};

financeAPI.interceptors.request.use(addAuthHeader);
chatAPI.interceptors.request.use(addAuthHeader);
