import api from './api';

const getCategory = async (data) => {
  const result = await api.get(`/category`, {
    token: true,
    body: data,
  });
  return result.data;
};

const categoryApi = {
  getCategory,
};

export default categoryApi;
