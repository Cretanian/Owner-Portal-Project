import { Axios } from ".";

export const getStatements = async () => {
  const result = await Axios.get("/statements");

  return result.data;
};

export const getStatementById = async (id) => {
  const result = await Axios.get(`/statements/${id}`);

  return result.data;
};
