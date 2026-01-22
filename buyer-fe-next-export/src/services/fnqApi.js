import utils from '@/utils';
import api from './api';

const getListFandQ = async (data) => {
  const result = await api.get(`/fnq/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const fnqApi = {
  getListFandQ,
};

export default fnqApi;
