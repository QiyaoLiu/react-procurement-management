import http from "./axios";

//Permission Management
export const getPermission = (user) => {
  return http.request({
    url: `/login`,
    method: "post",
    data: user, // Ensure user data is sent in the request body
  });
};

//Counts of Data
export const countSupplierMonth = () => {
  return http.request({
    url: "/count/supplier-month",
    method: "get",
  });
};

export const countSupplierTotal = () => {
  return http.request({
    url: "/count/supplier-total",
    method: "get",
  });
};

export const countOrderMonth = () => {
  return http.request({
    url: "/count/order-month",
    method: "get",
  });
};

export const countAmountMonth = () => {
  return http.request({
    url: "/count/amount-month",
    method: "get",
  });
};

//Supplier Management
export const getSupplier = (params) => {
  return http.request({
    url: "/suppliers",
    method: "get",
    params,
  });
};

export const addSupplier = (data) => {
  return http.request({
    url: "/suppliers",
    method: "post",
    data,
  });
};

export const updateSupplier = (data) => {
  return http.request({
    url: "/suppliers",
    method: "put",
    data,
  });
};

export const delSupplier = (id) => {
  return http.request({
    url: `/suppliers/{id}`,
    method: "delete",
  });
};

//Order Management

export const getOrder = (params) => {
  return http.request({
    url: "/orders",
    method: "get",
    params,
  });
};

export const addOrder = (data) => {
  return http.request({
    url: "/orders",
    method: "post",
    data,
  });
};

export const updateOrder = (data) => {
  return http.request({
    url: "/orders",
    method: "put",
    data,
  });
};

export const delOrder = (id) => {
  return http.request({
    url: `/order/${id}`,
    method: "delete",
  });
};
