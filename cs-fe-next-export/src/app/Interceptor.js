'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  SUCCESS,
  REQUIRE_SIGNUP_ERROR,
  TOKEN_NOT_FOUND_ERROR,
  TOKEN_INVALIDE_ERROR,
  DUPLICATE_ERROR,
  ARGUMENT_NOT_VALID_ERROR,
  REQ_MESSAGE_NOT_READABLE_ERROR,
  REQ_METHOD_NOT_SUPPORTED_ERROR,
  JPA_INTERNAL_ERROR,
  TIME_OUT_ERROR,
  FILE_MAX_SIZE_ERROR,
  ETC_ERROR,
} from '@/constants/errorCode';
import utils from '@/utils';
import useModal from '@/hooks/useModal';
import { loadingState } from '@/stores/commonRecoil';
import { customLoadingState } from '@/stores/commonRecoil';
import issueApi from '@/services/issueApi';
import useSession from '@/hooks/useSession';
import { ACCOUNT } from '@/constants/pageURL';
import { loadingNoShadeState } from '@/stores/commonRecoil';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import useMove from '@/hooks/useMove';
import { useRouter } from 'next/navigation';

const API_PRINT_LOG = process.env.CUSTOM_API_PRINT_LOG;

const apiInstance = axios.create({
  baseURL: process.env.CUSTOM_API_URL,
  timeout: process.env.CUSTOM_API_TIMEOUT,
});

let refreshing = false;
let requestsQueue = [];

const Interceptor = ({ children }) => {
  const router = useRouter();
  const { localeText } = useLocale();

  const includeCode = [
    TOKEN_NOT_FOUND_ERROR,
    TOKEN_INVALIDE_ERROR,
    ARGUMENT_NOT_VALID_ERROR,
    REQ_MESSAGE_NOT_READABLE_ERROR,
    REQ_METHOD_NOT_SUPPORTED_ERROR,
    JPA_INTERNAL_ERROR,
    TIME_OUT_ERROR,
    FILE_MAX_SIZE_ERROR,
    ETC_ERROR,
  ];

  const [globalLoading, setGlobalLoading] = useRecoilState(loadingState);
  const setGlobalLoadingNoShade = useSetRecoilState(loadingNoShadeState);
  const [globalCustomLoading, setGlobalCustomLoading] =
    useRecoilState(customLoadingState);

  const { removeUserInfo, removeAdminUserInfo } = useSession();

  const { openModal } = useModal();

  useEffect(() => {
    apiInstance.interceptors.request.use(
      (config) => {
        return requestHandler(config);
      },
      (error) => {
        return errorHandler(error);
      },
    );
    apiInstance.interceptors.response.use(
      (response) => {
        return responseHandler(response);
      },
      (error) => {
        return errorHandler(error);
      },
    );
  }, []);

  const initLoading = () => {
    setGlobalLoading(false);
    setGlobalCustomLoading(false);
    setGlobalLoadingNoShade(false);
  };

  const getIssueToken = async (response) => {
    let result = null;
    const param = {
      refreshToken: utils.getRefreshToken(),
    };
    console.log(
      '#########################################################################',
    );
    result = await issueApi.patchIssueAccessToken(param);
    return result;
  };

  const requestHandler = (config) => {
    const tempConfig = config;
    if (tempConfig?.customLoading) {
      setGlobalCustomLoading(true);
    } else if (tempConfig.loadding && globalLoading === false) {
      setGlobalLoading(true);
      if (tempConfig.noShade) {
        setGlobalLoadingNoShade(true);
      }
    }
    tempConfig.headers = getheaders(tempConfig);
    if (API_PRINT_LOG) {
      if (tempConfig.method.toUpperCase() === 'GET') {
        console.log(
          `[ >> API-REQ ] URL '${tempConfig.url}' PARAMS`,
          tempConfig.params,
        );
      } else {
        console.log(
          `[ >> API-REQ ] URL '${tempConfig.url}' DATA`,
          tempConfig.data,
        );
      }
    }
    return tempConfig;
  };

  const getheaders = (tempConfig) => {
    let headerOptions = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      lang: utils.getLang(),
    };
    if (tempConfig?.customHeaders) {
      headerOptions = Object.assign(headerOptions, tempConfig.customHeaders);
    }
    if (tempConfig?.token) {
      headerOptions.Authorization = `Bearer ${utils.getAccessToken()}`;
    }
    return headerOptions;
  };

  const responseHandler = async (response) => {
    if (response.status === 200) {
      const errorCode = response.data.errorCode;
      try {
        if (API_PRINT_LOG) {
          console.log(
            `[ << API-RES  ] api: ${response.config.url}, response: `,
            response.status === 200 ? response.data : response,
          );
        }
        if (
          errorCode === TOKEN_INVALIDE_ERROR &&
          response?.config?.isCommonError === true
        ) {
          if (!refreshing) {
            refreshing = true;
            requestsQueue.push(response.config);
            const result = await getIssueToken(response);
            if (result.data.errorCode === SUCCESS) {
              const accessToken = result.data.data.accessToken;
              utils.setAccessToken(accessToken);
              setTimeout(async () => {
                const promises = requestsQueue.map(async (queueConfig) => {
                  apiInstance(queueConfig);
                });
                await Promise.all(promises);
                refreshing = false;
                requestsQueue = [];
              }, 200);
            }
          } else {
            requestsQueue.push(response.config);
          }
        }
        if (includeCode.includes(errorCode)) {
          return errorHandler(response);
        }
        return response;
      } catch (catchError) {
        return errorHandler(response);
      } finally {
        initLoading();
      }
    }
  };

  const errorHandler = (error) => {
    if (utils.isNotEmpty(error?.data)) {
      return apiErrorHandle(error);
    }
    initLoading();
    const tempError = { ...error, errorCdoe: 500, errorMsg: error };
    console.log(`[## SERVER-ERROR ##] error:`, tempError);
    setTimeout(() => {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.REQUEST_FAILED),
      });
    });
    return tempError;
  };

  const apiErrorHandle = (error) => {
    console.log(`[## API-ERROR ##] error:`, error);
    initLoading();
    const { errorCode } = error.data;
    let { message } = error.data;
    const changeMsg = [
      {
        org: 'orgText',
        change: 'change\ntext',
      },
    ];
    changeMsg.forEach((info) => {
      if (message === info.org) {
        message = info.change;
      }
    });
    if (error.config.isCommonError === true) {
      if (errorCode === TOKEN_NOT_FOUND_ERROR) {
        router.replace(ACCOUNT.LOGIN);
      } else if (errorCode === TOKEN_INVALIDE_ERROR) {
        router.replace(ACCOUNT.LOGIN);
        return error;
      }
    }

    if (error.config.isCommonError) {
      setTimeout(() => {
        openModal({
          text: message || localeText(LANGUAGES.INFO_MSG.JOB_REQUEST_FAILED),
        });
      });
    }
    return error;
  };

  return children;
};

export default apiInstance;
export { Interceptor };
