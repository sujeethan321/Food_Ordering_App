import axiosClient from "./axiosClient";

export const placeOrder = (items) =>
  axiosClient.post("/orders/", { items });

export const getMyOrders = () => axiosClient.get("/orders/my-orders");
export const getOrderById = (id) => axiosClient.get(`/orders/${id}`);