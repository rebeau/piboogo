import api from './api';

const getListPromotionProduct = async (data) => {
  const result = await api.get(`/promotion-product/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const promotionProductApi = {
  getListPromotionProduct,
};

export default promotionProductApi;
