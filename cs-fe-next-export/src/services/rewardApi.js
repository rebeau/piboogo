import api from './api';

const getListRewardBuyer = async (data) => {
  const result = await api.get(`/reward/list/buyer`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postReward = async (data) => {
  const result = await api.post(`/reward`, {
    token: true,
    body: data,
  });
  return result.data;
};

const rewardApi = {
  getListRewardBuyer,
  postReward,
};

export default rewardApi;
