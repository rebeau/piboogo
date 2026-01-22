import api from './api';

const deletePromotion = async (data) => {
  const result = await api.delete(`/promotion`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getPromotion = async (data) => {
  const result = await api.get(`/promotion`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getPromotionMaxMainIdx = async (data) => {
  const result = await api.get(`/promotion/max-main-idx`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListPromotion = async (data) => {
  const result = await api.get(`/promotion/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListPromotionApproval = async (data) => {
  const result = await api.get(`/promotion/list/approval`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchPromotion = async (data) => {
  const result = await api.patch(`/promotion`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchPromotionApproval = async (data) => {
  const result = await api.patch(`/promotion/approval`, {
    token: true,
    body: data,
  });
  return result.data;
};

const promotionApi = {
  deletePromotion,
  getPromotion,
  getPromotionMaxMainIdx,
  getListPromotion,
  getListPromotionApproval,
  patchPromotion,
  patchPromotionApproval,
};

export default promotionApi;
