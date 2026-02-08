import { Axios } from ".";

export const getListings = async () => {
  const result = await Axios.get("/listings");

  return result.data;
};
