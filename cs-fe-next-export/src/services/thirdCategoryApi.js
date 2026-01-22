import api from './api';

const deleteThirdCategory = async (data) => {
  const result = await api.delete(`/third-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListThirdCategory = async (data) => {
  const result = await api.get(`/third-category/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchThirdCategory = async (data) => {
  const result = await api.patch(`/third-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postThirdCategory = async (data) => {
  const result = await api.post(`/third-category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const thirdCategoryApi = {
  deleteThirdCategory,
  getListThirdCategory,
  patchThirdCategory,
  postThirdCategory,
};

export default thirdCategoryApi;
