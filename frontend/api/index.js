import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const getStatements = async () => {
  const result = await Axios.get("/statements");

  return result.data;
};

export const getStatementById = async (id) => {
  const result = await Axios.get(`/statements/${id}`);

  return result.data;
};
