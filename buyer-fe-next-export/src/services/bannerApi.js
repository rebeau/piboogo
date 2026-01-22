import utils from '@/utils';
import api from './api';

const getListBanner = async (data) => {
  const result = await api.get(`/banner/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const bannerApi = {
  getListBanner,
};

export default bannerApi;
