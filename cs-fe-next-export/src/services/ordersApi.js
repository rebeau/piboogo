import api from './api';

const getListOrders = async (data) => {
  const result = await api.get(`/orders/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListOrdersSales = async (data) => {
  const result = await api.get(`/orders/list/sales`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchOrdersStatus = async (data) => {
  const result = await api.patch(`/orders/status`, {
    token: true,
    body: data,
  });
  return result.data;
};

const ordersApi = {
  getListOrders,
  getListOrdersSales,
  patchOrdersStatus,
};

export default ordersApi;
