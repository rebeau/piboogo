import utils from '@/utils';
import api from './api';

const getListNotice = async (data) => {
  const result = await api.get(`/notice/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const noticeApi = {
  getListNotice,
};

export default noticeApi;
