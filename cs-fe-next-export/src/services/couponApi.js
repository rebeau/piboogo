import api from './api';

const deleteCoupon = async (data) => {
  const result = await api.delete(`/coupon`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListCoupon = async (data) => {
  const result = await api.get(`/coupon/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchCoupon = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqModifyCouponDTO', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('couponImage', images[i]);
  }
  const result = await api.patch(`/coupon`, {
    token: true,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const postCoupon = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqAddCouponDTO', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('couponImage', images[i]);
  }
  const result = await api.post(`/coupon`, {
    token: true,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const couponApi = {
  deleteCoupon,
  getListCoupon,
  patchCoupon,
  postCoupon,
};

export default couponApi;
