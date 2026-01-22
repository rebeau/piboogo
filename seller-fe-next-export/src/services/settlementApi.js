import api from './api';

const getListSettlement = async (data) => {
  const result = await api.get(`/settlement/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const settlementApi = {
  getListSettlement,
};

export default settlementApi;
