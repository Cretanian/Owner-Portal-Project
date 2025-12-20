import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:5000",
});

export const getListings = async () => {
  const result = await Axios.get("/listings");

  console.log(result.data);

  return result.data;
};
