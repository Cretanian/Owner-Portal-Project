import { Axios } from ".";

export const getMetrics = async (filters) => {
  const result = await Axios.get("/analytics/metrics", {
    params: filters,
  });

  return result.data;
};
