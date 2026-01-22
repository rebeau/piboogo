import api from './api';

const getListSettlement = async (data) => {
  const result = await api.get(`/settlement/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListSettlementSeller = async (data) => {
  const result = await api.get(`/settlement/list/seller`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchSettlementSellerPayStatus = async (data) => {
  const result = await api.patch(`/settlement/sellerPayStatus`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchSettlementReturn = async (data) => {
  const result = await api.patch(`/settlement/return`, {
    token: true,
    body: data,
  });
  return result.data;
};

const settlementApi = {
  getListSettlement,
  getListSettlementSeller,
  patchSettlementSellerPayStatus,
  patchSettlementReturn,
};

export default settlementApi;
