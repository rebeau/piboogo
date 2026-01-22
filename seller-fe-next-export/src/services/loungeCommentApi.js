import api from './api';

const deleteLoungeComment = async (data) => {
  const result = await api.delete(`/lounge-comment`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getListLoungeComment = async (data) => {
  const result = await api.get(`/lounge-comment/list`, {
    token: true,
    body: data,
  });
  return result.data;
};

const postLoungeComment = async (data, images) => {
  const result = await api.post(`/lounge-comment`, {
    token: true,
    body: data,
  });
  return result.data;
};

const loungeCommentApi = {
  deleteLoungeComment,
  getListLoungeComment,
  postLoungeComment,
};

export default loungeCommentApi;
