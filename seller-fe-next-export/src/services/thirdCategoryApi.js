import api from './api';

const getListThirdCategory = async (data) => {
  const result = await api.get(`/third-category/list`, {
    token: false,
    body: data,
  });
  return result.data;
};

const thirdCategoryApi = {
  getListThirdCategory,
};

export default thirdCategoryApi;
