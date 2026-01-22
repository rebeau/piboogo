import utils from '@/utils';
import api from './api';

const postStripe = async (data) => {
  const result = await api.post(`/stripe`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const stripeApi = {
  postStripe,
};

export default stripeApi;
