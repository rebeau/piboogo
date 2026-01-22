import api from './api';

const deletePartnerSeller = async (data) => {
  const result = await api.delete(`/partner-seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListPartnerSeller = async (data) => {
  const result = await api.get(`/partner-seller/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchPartnerSeller = async (data) => {
  const result = await api.patch(`/partner-seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postPartnerSeller = async (data) => {
  const result = await api.post(`/partner-seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const partnerSellerApi = {
  deletePartnerSeller,
  getListPartnerSeller,
  patchPartnerSeller,
  postPartnerSeller,
};

export default partnerSellerApi;
