import utils from '@/utils';
import api from './api';

const getListHoldingCoupon = async (data) => {
  const result = await api.get(`/holding-coupon/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const holdingCouponApi = {
  getListHoldingCoupon,
};

export default holdingCouponApi;
