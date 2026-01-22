import api from './api';

const deleteLounge = async (data) => {
  const result = await api.delete(`/lounge`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getLounge = async (data) => {
  const result = await api.get(`/lounge`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListLounge = async (data) => {
  const result = await api.get(`/lounge/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const loungeApi = {
  deleteLounge,
  getLounge,
  getListLounge,
};

export default loungeApi;
