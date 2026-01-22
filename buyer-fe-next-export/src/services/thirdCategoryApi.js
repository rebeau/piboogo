import utils from '@/utils';
import api from './api';

const getListThirdCategory = async (data) => {
  const result = await api.get(`/third-category/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const thirdCategoryApi = {
  getListThirdCategory,
};

export default thirdCategoryApi;
