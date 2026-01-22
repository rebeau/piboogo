import utils from '@/utils';
import api from './api';

const getListProductQuestion = async (data) => {
  const result = await api.get(`/product-question/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListProductQuestionOwn = async (data) => {
  const result = await api.get(`/product-question/list/own`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const postProductQuestion = async (data) => {
  const result = await api.post(`/product-question`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
    // noShade: false,
  });
  return result.data;
};

const productQuestionApi = {
  getListProductQuestion,
  getListProductQuestionOwn,
  postProductQuestion,
};

export default productQuestionApi;
