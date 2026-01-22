import api from './api';

const getListCategory = async (data) => {
  const result = await api.get(`/category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const categoryApi = {
  getListCategory,
};

export default categoryApi;
