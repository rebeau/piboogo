import api from './api';

const deleteFirstCategory = async (data) => {
  const result = await api.delete(`/first-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListFirstCategory = async (data) => {
  const result = await api.get(`/first-category/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchFirstCategory = async (data) => {
  const result = await api.patch(`/first-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postFirstCategory = async (data) => {
  const result = await api.post(`/first-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const firstCategoryApi = {
  deleteFirstCategory,
  getListFirstCategory,
  patchFirstCategory,
  postFirstCategory,
};

export default firstCategoryApi;
