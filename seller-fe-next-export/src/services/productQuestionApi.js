import api from './api';

const getListProductQuestion = async (data) => {
  const result = await api.get(`/product-question/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchProductQuestion = async (data) => {
  const result = await api.patch(`/product-question`, {
    token: true,
    body: data,
    // noShade: false,
  });
  return result.data;
};

const productQuestionApi = {
  getListProductQuestion,
  patchProductQuestion,
};

export default productQuestionApi;
