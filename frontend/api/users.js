import { Axios } from ".";

export const getAllUsers = async () => {
  const result = await Axios.get("/users");

  return result.data;
};

export const getMyInfo = async () => {
  const result = await Axios.get("/users/my-info");

  return result.data;
};

export const setPassword = async (userId, password) => {
  const result = await Axios.put(`/users/${userId}/password`, { password });

  return result.data;
};
