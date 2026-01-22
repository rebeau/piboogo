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

const getLoungeMain = async (data) => {
  const result = await api.get(`/lounge/main`, {
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

const patchLounge = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqModifyLoungeDTO', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('loungeImages', images[i]);
  }
  const result = await api.patch(`/lounge`, {
    token: true,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const postLounge = async (data, images) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqAddLoungeDTO ', blobData);
  for (let i = 0; i < images.length; i++) {
    frm.append('loungeImages', images[i]);
  }
  const result = await api.post(`/lounge`, {
    token: true,
    body: frm,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const loungeApi = {
  deleteLounge,
  getLounge,
  getLoungeMain,
  getListLounge,
  patchLounge,
  postLounge,
};

export default loungeApi;
