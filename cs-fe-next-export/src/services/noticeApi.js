import api from './api';

const deleteNotice = async (data) => {
  const result = await api.delete(`/notice`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getNotice = async (data) => {
  const result = await api.get(`/notice`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListNotice = async (data) => {
  const result = await api.get(`/notice/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchNotice = async (data) => {
  const result = await api.patch(`/notice`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postNotice = async (data) => {
  const result = await api.post(`/notice`, {
    token: true,
    body: data,
  });
  return result.data;
};

const noticeApi = {
  deleteNotice,
  getNotice,
  getListNotice,
  patchNotice,
  postNotice,
};

export default noticeApi;
