import api from './api';

const getListOrdersProductBuyer = async (data) => {
  const result = await api.get(`/orders-product/list/buyer`, {
    token: true,
    body: data,
  });
  return result.data;
};

const ordersProductApi = {
  getListOrdersProductBuyer,
};

export default ordersProductApi;
