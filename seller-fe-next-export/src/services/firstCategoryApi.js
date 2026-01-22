import api from './api';

const getListFirstCategory = async (data) => {
  const result = await api.get(`/first-category/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const firstCategoryApi = {
  getListFirstCategory,
};

export default firstCategoryApi;
