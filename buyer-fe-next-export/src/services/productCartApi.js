import utils from '@/utils';
import api from './api';

const deleteProductCart = async (data) => {
  const result = await api.delete(`/product-cart`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListProductCart = async (data) => {
  const result = await api.get(`/product-cart/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const patchProductCart = async (data) => {
  const result = await api.patch(`/product-cart`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
    // noShade: false,
  });
  return result.data;
};

const postProductCart = async (data) => {
  const result = await api.post(`/product-cart`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
    // noShade: false,
  });
  return result.data;
};

const productCartApi = {
  deleteProductCart,
  getListProductCart,
  patchProductCart,
  postProductCart,
};

export default productCartApi;
