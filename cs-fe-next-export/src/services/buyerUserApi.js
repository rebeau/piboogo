import api from './api';

const getBuyerUser = async (data) => {
  const result = await api.get(`/buyer-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListBuyerUser = async (data) => {
  const result = await api.get(`/buyer-user/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListBuyerUserGrade = async (data) => {
  const result = await api.get(`/buyer-user/list/grade`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchBuyerUser = async (data) => {
  const result = await api.patch(`/buyer-user`, {
    token: true,
    body: data,
  });
  return result.data;
};

const buyerUserApi = {
  getBuyerUser,
  getListBuyerUser,
  getListBuyerUserGrade,
  patchBuyerUser,
};

export default buyerUserApi;
