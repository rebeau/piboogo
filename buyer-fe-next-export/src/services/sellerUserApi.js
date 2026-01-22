import utils from '@/utils';
import api from './api';

const getSeller = async (data) => {
  const result = await api.get(`/seller-user`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListSellerRecent = async (data) => {
  const result = await api.get(`/seller-user/list/recent`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const sellerApi = {
  getSeller,
  getListSellerRecent,
};

export default sellerApi;
