import utils from '@/utils';
import api from './api';

const getSeller = async (data) => {
  const result = await api.get(`/seller-user`, {
    token: false,
    body: data,
    isCommonError: false,
    isSimpleApi: true,
  });
  return result.data;
};

const getSellerRefreshToken = async (data) => {
  const result = await api.get(`/seller-user/refresh-token`, {
    token: false,
    body: data,
    isSimpleApi: true,
  });
  return result.data;
};

const getSellerMyInfo = async (data) => {
  const result = await api.get(`/seller-user/my-info`, {
    token: true,
    body: data,
  });
  return result.data;
};

const getSellerFindPassword = async (data) => {
  const result = await api.get(`/seller-user/find-pw`, {
    token: false,
    body: data,
    isSimpleApi: true,
  });
  return result.data;
};

const getSellerFindEmail = async (data) => {
  const result = await api.get(`/seller-user/find-id`, {
    token: false,
    body: data,
    isSimpleApi: true,
  });
  return result.data;
};

const getSellerEmailVerification = async (data) => {
  const result = await api.get(`/seller-user/email-verification`, {
    token: false,
    body: data,
    isSimpleApi: true,
  });
  return result.data;
};

const getSellerEmailVerificationSend = async (data) => {
  const result = await api.get(`/seller-user/email-verification/send`, {
    token: false,
    body: data,
    isSimpleApi: true,
  });
  return result.data;
};

const patchSeller = async (
  data,
  brandLogoImage,
  brandBannerImage,
  companyCertificateImage,
  accImage,
) => {
  const frm = new FormData();
  let tempData = data || {};
  const blobData = new Blob([JSON.stringify(tempData)], {
    type: 'application/json',
  });
  frm.append('rqModifySellerUserDTO', blobData);
  if (brandLogoImage?.size > 0) {
    frm.append('brandLogoImage', brandLogoImage);
  }
  if (brandBannerImage?.size > 0) {
    frm.append('brandBannerImage', brandBannerImage);
  }
  if (companyCertificateImage?.size > 0) {
    frm.append('companyCertificateImage', companyCertificateImage);
  }
  if (accImage?.size > 0) {
    frm.append('accImage', accImage);
  }
  const result = await api.patch(`/seller-user`, {
    token: true,
    body: frm,
    isCommonError: false,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const postSeller = async (
  data,
  brandLogoImage,
  brandBannerImage,
  companyCertificateImage,
  accImage,
) => {
  const frm = new FormData();
  let tempData = data || {};
  const blobData = new Blob([JSON.stringify(tempData)], {
    type: 'application/json',
  });
  frm.append('rqAddSellerUserDTO', blobData);
  if (brandLogoImage?.size > 0) {
    frm.append('brandLogoImage', brandLogoImage);
  }
  if (brandBannerImage?.size > 0) {
    frm.append('brandBannerImage', brandBannerImage);
  }
  if (companyCertificateImage?.size > 0) {
    frm.append('companyCertificateImage', companyCertificateImage);
  }
  if (accImage?.size > 0) {
    frm.append('accImage', accImage);
  }
  const result = await api.post(`/seller-user`, {
    token: false,
    body: frm,
    isCommonError: false,
    isSimpleApi: true,
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });
  return result.data;
};

const sellerUserApi = {
  getSeller,
  getSellerRefreshToken,
  getSellerMyInfo,
  getSellerFindEmail,
  getSellerFindPassword,
  getSellerEmailVerification,
  getSellerEmailVerificationSend,
  patchSeller,
  postSeller,
};

export default sellerUserApi;
