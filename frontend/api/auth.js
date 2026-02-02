import { Axios } from ".";

export const login = async (email, password) => {
  const result = await Axios.post("/auth/login", { email, password });

  return result.data;
};

export const refreshAccessToken = async () => {
  const result = await Axios.post("/auth/refresh");

  return result.data;
};

export const logout = async () => {
  const result = await Axios.post(`/auth/logout`);

  return result.data;
};
