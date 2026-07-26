import { authAPI } from "./api";

export const register = async (data) => {
  const res = await authAPI.post("/api/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await authAPI.post("/api/auth/login", data);
  return res.data;
};
