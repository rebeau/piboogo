'use client';

import {
  STROAGE_ADMIN_AUTO_LOGIN_KEY,
  STROAGE_ADMIN_TOKEN_ID,
  STROAGE_ADMIN_REF_TOKEN_ID,
  STROAGE_USER_INFO,
  STROAGE_AUTO_LOGIN_KEY,
  STROAGE_TOKEN_ID,
  STROAGE_REF_TOKEN_ID,
  STROAGE_FCM_TOKEN_ID,
  STROAGE_LANG,
} from '@/constants/common';
import { isClient } from './deviceUtils';

// 저장소 세션
export const setSessionItem = (key, value) => {
  if (isClient()) {
    sessionStorage.setItem(key, value);
  }
};
export const setSessionItemJson = (key, value) => {
  setSessionItem(key, JSON.stringify(value));
};
export const getSessionItem = (key) => {
  if (isClient()) {
    return sessionStorage.getItem(key);
  }
};
export const getSessionItemJson = (key) => {
  if (isClient()) {
    return JSON.parse(getSessionItem(key));
  }
};
export const removeSessionItem = (key) => {
  if (isClient()) {
    sessionStorage.removeItem(key);
  }
};
// 저장소 로컬
export const setLocalItem = (key, value) => {
  if (isClient()) {
    localStorage.setItem(key, value);
  }
};
export const setLocalItemJson = (key, value) => {
  setLocalItem(key, JSON.stringify(value));
};
export const getLocalItem = (key) => {
  if (isClient()) {
    return localStorage.getItem(key) || null;
  }
};
export const getLocalItemJson = (key) => {
  if (isClient()) {
    const ret = getLocalItem(key);
    if (ret) {
      return JSON.parse(ret);
    } else {
      return ret;
    }
  }
};
export const removeLocalItem = (key) => {
  if (isClient()) {
    localStorage.removeItem(key);
  }
};

// 자동로그인
export const getAutoLogin = () => {
  return getLocalItemJson(STROAGE_AUTO_LOGIN_KEY) || false;
};
export const setAutoLogin = (value) => {
  setLocalItemJson(STROAGE_AUTO_LOGIN_KEY, value);
};
export const removeAutoLogin = () => {
  removeLocalItem(STROAGE_AUTO_LOGIN_KEY);
};

// 로그인 정보
export const getUserInfo = () => {
  return getLocalItemJson(STROAGE_USER_INFO);
};
export const setUserInfo = (value) => {
  setLocalItemJson(STROAGE_USER_INFO, value);
};
export const removeUserInfo = () => {
  removeLocalItem(STROAGE_USER_INFO);
};

// 소모성 로그인 정보
export const getUserInfoSession = () => {
  return getSessionItemJson(STROAGE_USER_INFO);
};
export const setUserInfoSession = (value) => {
  setSessionItemJson(STROAGE_USER_INFO, value);
};
export const resetUserInfoSession = () => {
  removeSessionItem(STROAGE_USER_INFO);
};

export const getIsLogin = () => {
  const userInfo = getSessionItemJson(STROAGE_USER_INFO);
  if (userInfo?.id) {
    return true;
  }
  return false;
};

// lang 언어
export const getLang = () => {
  return getLocalItem(STROAGE_LANG);
};
export const setLang = (lang) => {
  setLocalItem(STROAGE_LANG, lang);
};

// fmcToken
export const getFcmToken = () => {
  return getSessionItemJson(STROAGE_FCM_TOKEN_ID);
};
export const setFcmToken = (value) => {
  setSessionItemJson(STROAGE_FCM_TOKEN_ID, value);
};

// 토큰 사용자
export const setAccessToken = (value) => {
  setLocalItem(STROAGE_TOKEN_ID, value);
};
export const getAccessToken = () => {
  return getLocalItem(STROAGE_TOKEN_ID);
};
export const getRefreshToken = () => {
  return getLocalItem(STROAGE_REF_TOKEN_ID);
};
export const setRefreshToken = (value) => {
  setLocalItem(STROAGE_REF_TOKEN_ID, value);
};
export const removeAccessToken = (value) => {
  removeLocalItem(STROAGE_TOKEN_ID, value);
};
export const removeRefreshToken = (value) => {
  removeLocalItem(STROAGE_REF_TOKEN_ID, value);
};
// 토큰 관리자
export const setAdminAccessToken = (value) => {
  setSessionItem(STROAGE_ADMIN_TOKEN_ID, value);
};
export const getAdminAccessToken = () => {
  return getSessionItem(STROAGE_ADMIN_TOKEN_ID);
};
export const getAdminRefreshToken = () => {
  return getSessionItem(STROAGE_ADMIN_REF_TOKEN_ID);
};
export const setAdminRefreshToken = (value) => {
  setSessionItem(STROAGE_ADMIN_REF_TOKEN_ID, value);
};
export const removeAdminAccessToken = (value) => {
  removeLocalItem(STROAGE_ADMIN_TOKEN_ID, value);
};
export const removeAdminRefreshToken = (value) => {
  removeLocalItem(STROAGE_ADMIN_REF_TOKEN_ID, value);
};

// 초기화 관련
export const removeAppStorage = () => {
  removeLocalItem('recoil-persist');
  removeSessionItem('recoil-persist');
  removeLocalItem(STROAGE_USER_INFO);
  removeLocalItem(STROAGE_AUTO_LOGIN_KEY);
  removeLocalItem(STROAGE_KEY);
  removeLocalItem(STROAGE_LOADING);
  removeLocalItem(STROAGE_TOKEN_ID);
  removeLocalItem(STROAGE_REF_TOKEN_ID);
  removeSessionItem(STROAGE_USER_INFO);
  removeSessionItem(STROAGE_AUTO_LOGIN_KEY);
  removeSessionItem(STROAGE_KEY);
  removeSessionItem(STROAGE_LOADING);
  removeSessionItem(STROAGE_TOKEN_ID);
  removeSessionItem(STROAGE_REF_TOKEN_ID);
  removeLocalItem(STROAGE_LANG);
};

export const removeUserStorage = () => {
  removeLocalItem(STROAGE_USER_INFO);
  removeLocalItem(STROAGE_AUTO_LOGIN_KEY);
  removeLocalItem(STROAGE_TOKEN_ID);
  removeLocalItem(STROAGE_REF_TOKEN_ID);
  removeSessionItem(STROAGE_USER_INFO);
  removeSessionItem(STROAGE_AUTO_LOGIN_KEY);
  removeSessionItem(STROAGE_TOKEN_ID);
  removeSessionItem(STROAGE_REF_TOKEN_ID);
  removeLocalItem(STROAGE_LANG);
};
