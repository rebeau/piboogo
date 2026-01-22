import apiInstance from '@/app/Interceptor';

/*
("/v1/seller-user", "POST"), // 회원 가입 API
("/v1/seller-user", "GET"), // 계정 로그인 API
("/v1/seller-user/find-id", "GET"), // 이메일 찾기 API
("/v1/seller-user/find-pw", "GET"), // 비밀번호 찾기 API
("/v1/seller-user/email-verification/send", "GET"), // 인증 메일 전송 API
("/v1/seller-user/email-verification", "GET"), // 이메일 인증 API
("/v1/seller-user/refresh-token", "GET") // 토큰 재발급(재로그인) API
*/

const API_URL = process.env.CUSTOM_API_URL;
const API_VERSION = process.env.CUSTOM_API_VERSION;
const apiFunction = (method) => {
  return async (
    url,
    {
      body = {},
      token = false,
      issue = false,
      customHeaders = {},
      loadding = true,
      noShade = true,
      customLoading = false,
      customLoadingText = '',
      isCommonError = true,
      timeout,
    } = {},
  ) => {
    if (method === 'POST') {
      const result = await apiInstance.post(API_VERSION + url, body, {
        token,
        issue,
        customHeaders,
        loadding,
        noShade,
        customLoading,
        customLoadingText,
        isCommonError,
        timeout,
      });
      return result;
    }

    if (method === 'GET') {
      const result = await apiInstance.get(API_VERSION + url, {
        token,
        issue,
        params: body,
        loadding,
        noShade,
        customHeaders,
        customLoading,
        customLoadingText,
        isCommonError,
        timeout,
      });
      return result;
    }

    if (method === 'DELETE') {
      const result = await apiInstance.delete(API_VERSION + url, {
        token,
        issue,
        data: body,
        loadding,
        noShade,
        customLoading,
        customLoadingText,
        isCommonError,
        timeout,
      });
      return result;
    }

    if (method === 'PATCH') {
      const result = await apiInstance.patch(API_VERSION + url, body, {
        token,
        issue,
        customHeaders,
        loadding,
        noShade,
        customLoading,
        customLoadingText,
        isCommonError,
        timeout,
      });
      return result;
    }

    if (method === 'PUT') {
      const result = await apiInstance.put(
        API_VERSION + url,
        { data: body },
        { token },
      );
      return result;
    }
  };
};

const api = {
  post: apiFunction('POST'),
  get: apiFunction('GET'),
  delete: apiFunction('DELETE'),
  patch: apiFunction('PATCH'),
  put: apiFunction('PUT'),
};

export default api;
