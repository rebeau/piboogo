import api from './api';

const deleteBestSeller = async (data) => {
  const result = await api.delete(`/best-seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListBestSeller = async (data) => {
  const result = await api.get(`/best-seller/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchBestSeller = async (data) => {
  const result = await api.patch(`/best-seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postBestSeller = async (data) => {
  const result = await api.post(`/best-seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const bestSellerApi = {
  deleteBestSeller,
  getListBestSeller,
  patchBestSeller,
  postBestSeller,
};

export default bestSellerApi;
