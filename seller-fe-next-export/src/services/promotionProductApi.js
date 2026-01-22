import api from './api';

const deletePromotionProduct = async (data) => {
  const result = await api.delete(`/promotion-product`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListPromotionProduct = async (data) => {
  const result = await api.get(`/promotion-product/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postPromotionProduct = async (data) => {
  const result = await api.post(`/promotion-product`, {
    token: true,
    body: data,
  });
  return result.data;
};

const promotionProductApi = {
  deletePromotionProduct,
  getListPromotionProduct,
  postPromotionProduct,
};

export default promotionProductApi;
