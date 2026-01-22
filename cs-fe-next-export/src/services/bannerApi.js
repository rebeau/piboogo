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

const getListBannerApproval = async (data) => {
  const result = await api.get(`/banner/list/approval`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchBannerIdx = async (data) => {
  const result = await api.patch(`/banner/idx`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchBannerApproval = async (data) => {
  const result = await api.patch(`/banner/approval`, {
    token: true,
    body: data,
  });
  return result.data;
};

const bannerApi = {
  deleteBanner,
  getBanner,
  getListBanner,
  getListBannerApproval,
  patchBannerIdx,
  patchBannerApproval,
};

export default bannerApi;
