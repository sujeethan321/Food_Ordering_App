import axiosClient from "./axiosClient";

export const getCategories = () => axiosClient.get("/categories/");
export const getCategoryById = (id) => axiosClient.get(`/categories/${id}`);