import api from './api';

const getDashBoardStatistics = async (data) => {
  const result = await api.get(`/dash-board/statistics`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListDashBoard = async (data) => {
  const result = await api.get(`/dash-board/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const dashBoardApi = {
  getDashBoardStatistics,
  getListDashBoard,
};

export default dashBoardApi;
