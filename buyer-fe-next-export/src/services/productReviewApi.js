import utils from '@/utils';
import api from './api';

const getListProductReview = async (data) => {
  const result = await api.get(`/product-review/list`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getListProductReviewOwn = async (data) => {
  const result = await api.get(`/product-review/list/own`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const postProductReview = async (data, firstImage, secondImage, thirdImage) => {
  const frm = new FormData();
  const blobData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  frm.append('rqAddProductReviewDTO', blobData);
  if (utils.isNotEmpty(firstImage?.name)) {
    frm.append('firstImage', firstImage);
  }
  if (utils.isNotEmpty(secondImage?.name)) {
    frm.append('secondImage', secondImage);
  }
  if (utils.isNotEmpty(thirdImage?.name)) {
    frm.append('thirdImage', thirdImage);
  }
  const result = await api.post(`/product-review`, {
    token: utils.getIsLogin() ? true : false,
    body: frm,
    isCommonError: false,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const productReviewApi = {
  getListProductReview,
  getListProductReviewOwn,
  postProductReview,
};

export default productReviewApi;
