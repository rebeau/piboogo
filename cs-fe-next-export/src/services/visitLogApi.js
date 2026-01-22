import api from './api';

const postVisitLog = async (data) => {
  const result = await api.post(`/visit-log`, {
    token: true,
    body: data,
  });
  return result.data;
};

const visitLogApi = {
  postVisitLog,
};

export default visitLogApi;
