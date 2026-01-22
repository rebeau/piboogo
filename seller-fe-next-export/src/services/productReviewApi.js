import api from './api';

const getListProductReview = async (data) => {
  const result = await api.get(`/product-review/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const patchProductReview = async (data) => {
  const result = await api.patch(`/product-review`, {
    token: true,
    body: data,
  });
  return result.data;
};

const productReviewApi = {
  getListProductReview,
  patchProductReview,
};

export default productReviewApi;
