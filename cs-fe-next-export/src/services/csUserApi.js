import api from './api';

const deleteCsUser = async (data) => {
  const result = await api.delete(`/cs-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getCsUser = async (data) => {
  const result = await api.get(`/cs-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getCsUserRefreshToken = async (data) => {
  const result = await api.get(`/cs-user/refresh-token`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListCsUser = async (data) => {
  const result = await api.get(`/cs-user/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchCsUser = async (data) => {
  const result = await api.patch(`/cs-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postCsUser = async (data) => {
  const result = await api.post(`/cs-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const csUserApi = {
  deleteCsUser,
  getCsUser,
  getCsUserRefreshToken,
  getListCsUser,
  patchCsUser,
  postCsUser,
};

export default csUserApi;
