import api from './api';

const deleteProduct = async (data) => {
  const result = await api.delete(`/product`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getProduct = async (data) => {
  const result = await api.get(`/product`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListProduct = async (data) => {
  const result = await api.get(`/product/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListProductSeller = async (data) => {
  const result = await api.get(`/product/list/seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchProduct = async (data) => {
  const result = await api.patch(`/product`, {
    token: true,
    body: data,
  });
  return result.data;
};

const productApi = {
  deleteProduct,
  getProduct,
  getListProduct,
  getListProductSeller,
  patchProduct,
};

export default productApi;
