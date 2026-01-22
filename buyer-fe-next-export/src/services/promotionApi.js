import utils from '@/utils';
import api from './api';

const getPromotion = async (data) => {
  const result = await api.get(`/promotion`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListPromotion = async (data) => {
  const result = await api.get(`/promotion/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const promotionApi = {
  getPromotion,
  getListPromotion,
};

export default promotionApi;
