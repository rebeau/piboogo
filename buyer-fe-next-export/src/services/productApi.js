import utils from '@/utils';
import api from './api';

const getProduct = async (data) => {
  const result = await api.get(`/product`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListProduct = async (data) => {
  const result = await api.get(`/product/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListSellerProduct = async (data) => {
  const result = await api.get(`/product/list/seller`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const productApi = {
  getProduct,
  getListProduct,
  getListSellerProduct,
};

export default productApi;
