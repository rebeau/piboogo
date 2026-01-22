import api from './api';

const deleteFnq = async (data) => {
  const result = await api.delete(`/fnq`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListFnq = async (data) => {
  const result = await api.get(`/fnq/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchFnq = async (data) => {
  const result = await api.patch(`/fnq`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postFnq = async (data) => {
  const result = await api.post(`/fnq`, {
    token: true,
    body: data,
  });
  return result.data;
};

const fnqApi = {
  deleteFnq,
  getListFnq,
  patchFnq,
  postFnq,
};

export default fnqApi;
