import axiosClient from "./axiosClient";

export const getFoods = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.append(key, value);
    }
  });
  return axiosClient.get(`/foods/?${query.toString()}`);
};

export const getFoodById = (id) => axiosClient.get(`/foods/${id}`);