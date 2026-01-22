'use client';

import {
  STROAGE_AUTO_LOGIN_KEY,
  STROAGE_INIT_POP_FLAG,
  STROAGE_SNS_INFO,
} from '@/constants/common';
import { isClient, isLocalTest } from './deviceUtils';

export const initBridge = () => {
  if (!isClient()) return;
  const scriptBridge = document.createElement('script');
  scriptBridge.src = '/bridgeReturn.js';
  scriptBridge.onload = () => {
    if (isLocalTest()) {
      console.log('loaded bridgeReturn');
    }
  };
  document.body.appendChild(scriptBridge);
  const scriptMinterface = document.createElement('script');
  scriptMinterface.src = '/minterface.js';
  scriptMinterface.onload = () => {
    if (isLocalTest()) {
      console.log('loaded minterface');
    }
  };
  document.body.appendChild(scriptMinterface);
};

export const execute = (action, param, option = null) => {
  if (!isClient()) return;
  const { M } = window;
  if (M) {
    let result = null;
    if (option) {
      result = M.execute(action, param, option);
    } else if (param) {
      result = M.execute(action, param);
    } else {
      result = M.execute(action);
    }
    if (result) {
      return result;
    }
  }
};

export const getNativeMemory = (key) => {
  const result = execute('exGetNativeMemory', key);
  if (result) {
    if (typeof result === 'string') {
      return JSON.parse(result);
    }
    return result;
  } else {
    return result;
  }
};
export const setNativeMemory = (key, value) => {
  execute('exSetNativeMemory', key, JSON.stringify(value));
};

// fmcToken 추출
export const exGetFcmToken = () => {
  execute('exGetFcmToken');
};

// 자동 로그인
export const setMAutoLogin = (value) => {
  setNativeMemory(STROAGE_AUTO_LOGIN_KEY, value);
};
export const getMAutoLogin = () => {
  const result = getNativeMemory(STROAGE_AUTO_LOGIN_KEY);
  if (result) {
    if (typeof result === 'string') {
      return JSON.parse(result);
    }
    return result;
  }
};

export const setSnsInfo = (snsToken, snsType) => {
  setNativeMemory(STROAGE_SNS_INFO, {
    snsToken: snsToken || '',
    snsType: snsType || 0,
  });
};
export const getSnsInfo = () => {
  return getNativeMemory(STROAGE_SNS_INFO);
};

const getSnsTypeValue = (snsType) => {
  switch (Number(snsType)) {
    case 1:
      return 'kakao';
    case 2:
      return 'naver';
    case 3:
      return 'google';
    case 4:
      return 'apple';
    default:
      return 'Empty';
  }
};
export const exLogin = (snsType) => {
  return execute('exLogin', getSnsTypeValue(snsType));
};

export const exLogout = (snsType) => {
  return execute('exLogout', getSnsTypeValue(snsType));
};

export const getInitPopFlag = () => {
  const result = getNativeMemory(STROAGE_INIT_POP_FLAG);
  if (result) {
    if (typeof result === 'string') {
      return JSON.parse(result);
    }
    return result || false;
  } else {
    return false;
  }
};

export const setInitPopFlag = (value) => {
  setNativeMemory(STROAGE_INIT_POP_FLAG, value);
};
