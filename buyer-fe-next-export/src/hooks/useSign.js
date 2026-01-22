'use client';

const useSign = () => {
  window.onResultKakaoLogout = (data) => {
    console.log('onResultKakaoLogout');
  };

  window.onResultNaverLogout = (data) => {
    console.log('onResultNaverLogout');
  };

  window.onResultGoogleLogout = (data) => {
    console.log('onResultGoogleLogout');
  };

  window.onResultAppleLogout = (data) => {
    console.log('onResultAppleLogout');
  };

  return {};
};

export default useSign;
