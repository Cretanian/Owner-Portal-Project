import axios from "axios";

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const setAuthHeaders = (value) => {
  if (!value) delete Axios.defaults.headers.common["Authorization"];
  else Axios.defaults.headers.common["Authorization"] = `Bearer ${value}`;
};
