import apiInstance from '@/app/Interceptor';

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
