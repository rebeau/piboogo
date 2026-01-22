import utils from '@/utils';
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

const patchProduct = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqModifyProductUserDTO', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('productImages', images[i]);
  }
  const result = await api.patch(`/product`, {
    token: true,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const postProduct = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqAddProductDTO', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('productImages', images[i]);
  }
  const result = await api.post(`/product`, {
    token: true,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const productApi = {
  deleteProduct,
  getProduct,
  getListProduct,
  patchProduct,
  postProduct,
};

export default productApi;
