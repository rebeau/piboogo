import utils from '@/utils';
import api from './api';

const getListPartnerSeller = async (data) => {
  const result = await api.get(`/partner-seller/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const partnerSellerApi = {
  getListPartnerSeller,
};

export default partnerSellerApi;
