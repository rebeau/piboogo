import api from './api';

const deleteSecondCategory = async (data) => {
  const result = await api.delete(`/second-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListSecondCategory = async (data) => {
  const result = await api.get(`/second-category/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchSecondCategory = async (data) => {
  const result = await api.patch(`/second-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postSecondCategory = async (data) => {
  const result = await api.post(`/second-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const secondCategoryApi = {
  deleteSecondCategory,
  getListSecondCategory,
  patchSecondCategory,
  postSecondCategory,
};

export default secondCategoryApi;
