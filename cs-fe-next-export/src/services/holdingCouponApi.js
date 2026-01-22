import api from './api';

const getListHoldingCouponBuyer = async (data) => {
  const result = await api.get(`/holding-coupon/list/buyer`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postHoldingCoupon = async (data) => {
  const result = await api.post(`/holding-coupon`, {
    token: true,
    body: data,
  });
  return result.data;
};

const holdingCouponApi = {
  getListHoldingCouponBuyer,
  postHoldingCoupon,
};

export default holdingCouponApi;
