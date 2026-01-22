import utils from '@/utils';
import api from './api';

const getOrders = async (data) => {
  const result = await api.get(`/orders`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListOrders = async (data) => {
  const result = await api.get(`/orders/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const patchOrdersReturn = async (data) => {
  const result = await api.patch(`/orders/return`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const patchOrdersCancel = async (data) => {
  const result = await api.patch(`/orders/cancel`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const postOrders = async (data) => {
  const result = await api.post(`/orders`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const postOrdersStripe = async (data) => {
  const result = await api.post(`/orders/stripe`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const ordersApi = {
  getOrders,
  getListOrders,
  patchOrdersReturn,
  patchOrdersCancel,
  postOrders,
  postOrdersStripe,
};

export default ordersApi;
