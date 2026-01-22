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

const getListPromotion = async (data) => {
  const result = await api.get(`/promotion/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchPromotion = async (data, promotionImage) => {
  const frm = new FormData();
  let tempData = data || {};
  const blobData = new Blob([JSON.stringify(tempData)], {
    type: 'application/json',
  });
  frm.append('rqModifyPromotionDTO', blobData);
  if (promotionImage?.length > 0) {
    frm.append('promotionImage', promotionImage[0]);
  }
  const result = await api.patch(`/promotion`, {
    token: true,
    body: frm,
    isCommonError: false,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const postPromotion = async (data, promotionImage) => {
  const frm = new FormData();
  let tempData = data || {};
  const blobData = new Blob([JSON.stringify(tempData)], {
    type: 'application/json',
  });
  frm.append('rqAddPromotionDTO', blobData);
  if (promotionImage?.length > 0) {
    frm.append('promotionImage', promotionImage[0]);
  }
  const result = await api.post(`/promotion`, {
    token: true,
    body: frm,
    isCommonError: false,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const promotionApi = {
  deletePromotion,
  getPromotion,
  getListPromotion,
  patchPromotion,
  postPromotion,
};

export default promotionApi;
