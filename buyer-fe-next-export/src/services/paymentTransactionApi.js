import utils from '@/utils';
import api from './api';

const getPaymentTransaction = async (data) => {
  const result = await api.post(`/payment-transaction`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const paymentTransactionApi = {
  getPaymentTransaction,
};

export default paymentTransactionApi;
