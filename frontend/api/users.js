import { Axios } from ".";

export const getAllUsers = async () => {
  const result = await Axios.get("/users");

  return result.data;
};
