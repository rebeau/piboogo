import utils from '@/utils';
import api from './api';

const getSearch = async (data) => {
  const result = await api.get(`/search`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const searchApi = {
  getSearch,
};

export default searchApi;
