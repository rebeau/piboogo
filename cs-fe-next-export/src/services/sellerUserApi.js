import api from './api';

const getSeller = async (data) => {
  const result = await api.get(`/seller-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListSeller = async (data) => {
  const result = await api.get(`/seller-user/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchSeller = async (data) => {
  const result = await api.patch(`/seller-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const sellerUserApi = {
  getSeller,
  getListSeller,
  patchSeller,
};

export default sellerUserApi;
