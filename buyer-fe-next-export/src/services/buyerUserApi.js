import utils from '@/utils';
import api from './api';

const deleteNormalUser = async (data) => {
  const result = await api.delete(`/user/normalUser`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyer = async (data) => {
  const result = await api.get(`/buyer-user`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerRefreshToken = async (data) => {
  const result = await api.get(`/buyer-user/refresh-token`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerMyReward = async (data) => {
  const result = await api.get(`/buyer-user/my-reward`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerMyInfo = async (data) => {
  const result = await api.get(`/buyer-user/my-info`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerFindPassword = async (data) => {
  const result = await api.get(`/buyer-user/find-pw`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerFindEmail = async (data) => {
  const result = await api.get(`/buyer-user/find-id`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerEmailVerification = async (data) => {
  const result = await api.get(`/buyer-user/email-verification`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerEmailVerificationSend = async (data) => {
  const result = await api.get(`/buyer-user/email-verification/send`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const getBuyerCheckId = async (data) => {
  const result = await api.get(`/buyer-user/check-id`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
    isCommonError: false,
  });
  return result.data;
};

const patchBuyer = async (data, profileImage) => {
  const frm = new FormData();
  let tempData = data || {};
  const blobData = new Blob([JSON.stringify(tempData)], {
    type: 'application/json',
  });
  frm.append('rqModifyBuyerUserDTO', blobData);
  if (profileImage?.size > 0) {
    frm.append('profileImage', profileImage);
  }
  const result = await api.patch(`/buyer-user`, {
    token: utils.getIsLogin() ? true : false,
    body: frm,
    isCommonError: false,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const postBuyer = async (data) => {
  const result = await api.post(`/buyer-user`, {
    token: utils.getIsLogin() ? true : false,
    body: data,
  });
  return result.data;
};

const buyerApi = {
  getBuyer,
  getBuyerRefreshToken,
  getBuyerMyReward,
  getBuyerMyInfo,
  getBuyerFindEmail,
  getBuyerFindPassword,
  getBuyerEmailVerification,
  getBuyerEmailVerificationSend,
  getBuyerCheckId,
  patchBuyer,
  postBuyer,
};

export default buyerApi;
