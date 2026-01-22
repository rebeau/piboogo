import api from './api';

const getListSecondCategory = async (data) => {
  const result = await api.get(`/second-category/list`, {
    token: false,
    body: data,
  });
  return result.data;
};

const secondCategoryApi = {
  getListSecondCategory,
};

export default secondCategoryApi;
