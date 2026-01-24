import { Axios } from ".";

export const getMetrics = async (filters) => {
  const result = await Axios.get("/analytics/metrics", {
    params: filters,
  });

  return result.data;
};

export const getMonthlyAnalytics = async (filters) => {
  const result = await Axios.get("/analytics/monthly", {
    params: filters,
  });

  return result.data;
};

export const getPerChannelAnalytics = async (filters) => {
  const result = await Axios.get("/analytics/per-channel", {
    params: filters,
  });

  return result.data;
};
