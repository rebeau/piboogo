import utils from '@/utils';
import api from './api';

const deleteBanner = async (data) => {
  const result = await api.delete(`/banner`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getBanner = async (data) => {
  const result = await api.get(`/banner`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListBanner = async (data) => {
  const result = await api.get(`/banner/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchBanner = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqModifyBannerDTO', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('bannerImage', images[i]);
  }
  const result = await api.patch(`/banner`, {
    token: utils.getIsLogin() ? true : false,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const postBanner = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqAddBannerDTO', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('bannerImage', images[i]);
  }
  const result = await api.post(`/banner`, {
    token: utils.getIsLogin() ? true : false,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const bannerApi = {
  deleteBanner,
  getBanner,
  getListBanner,
  patchBanner,
  postBanner,
};

export default bannerApi;
