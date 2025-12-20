import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const getListings = async () => {
  const result = await Axios.get("/listings");

  console.log(result.data);

  return result.data;
};
