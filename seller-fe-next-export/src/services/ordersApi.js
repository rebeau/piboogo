import api from './api';

const getOrders = async (data) => {
  const result = await api.get(`/orders`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListOrders = async (data) => {
  const result = await api.get(`/orders/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchOrders = async (data) => {
  const result = await api.patch(`/orders`, {
    token: true,
    body: data,
  });
  return result.data;
};

const ordersApi = {
  getOrders,
  getListOrders,
  patchOrders,
};

export default ordersApi;
