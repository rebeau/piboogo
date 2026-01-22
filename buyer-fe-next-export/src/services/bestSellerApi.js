import utils from '@/utils';
import api from './api';

const getListBestSeller = async (data) => {
  const result = await api.get(`/best-seller/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const bestSellerApi = {
  getListBestSeller,
};

export default bestSellerApi;
