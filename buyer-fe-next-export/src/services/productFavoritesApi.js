import utils from '@/utils';
import api from './api';

const deleteProductFavorites = async (data) => {
  const result = await api.delete(`/product-favorites`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListProductFavorites = async (data) => {
  const result = await api.get(`/product-favorites/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const postProductFavorites = async (data) => {
  const result = await api.post(`/product-favorites`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
    // noShade: false,
  });
  return result.data;
};

const productFavoritesApi = {
  deleteProductFavorites,
  getListProductFavorites,
  postProductFavorites,
};

export default productFavoritesApi;
