import utils from '@/utils';
import api from './api';

const getListSellerCategory = async (data) => {
  const result = await api.get(`/seller-category/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const sellerCategoryApi = {
  getListSellerCategory,
};

export default sellerCategoryApi;
