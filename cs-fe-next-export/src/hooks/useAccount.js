'use client';

import { SUCCESS } from '@/constants/errorCode';
import { ACCOUNT, SERVICE } from '@/constants/pageURL';
import sellerUserApi from '@/services/sellerUserApi';
import { normalUserState } from '@/stores/userRecoil';
import utils from '@/utils';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import useModal from './useModal';
import useMove from './useMove';
import {
  STROAGE_AUTO_LOGIN_KEY,
  STROAGE_REF_TOKEN_ID,
  STROAGE_TOKEN_ID,
  STROAGE_USER_INFO,
} from '@/constants/common';

const useAccount = () => {
  const { moveLogin } = useMove();
  const pathName = usePathname();
  const { openModal } = useModal();

  /*
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
  */

  const userInfo = utils.getUserInfoSession();

  const setUserInfo = (info) => {
    utils.getUserInfoSession(info);
  };

  const listCheckPath = [ACCOUNT.LOGIN, ACCOUNT.FIND];

  useEffect(() => {
    const tempUserInfo = utils.getUserInfoSession();
    const isRequireInfo = handleCheckPath();
    if (utils.isEmpty(tempUserInfo) && isRequireInfo === true) {
      console.log('로그인이 필요한 서비스임');
      moveLogin();
    }
  }, [pathName]);

  const handleCheckPath = () => {
    let isCheck = true; // 기본값을 true로 설정

    for (let arrIndex = 0; arrIndex < listCheckPath.length; arrIndex++) {
      if (listCheckPath[arrIndex].indexOf(pathName) > -1) {
        isCheck = false;
        break; // pathName이 포함된 경우 더 이상 확인할 필요 없으므로 종료
      }
    }

    return isCheck; // true (포함되지 않은 경우) 또는 false (포함된 경우)
  };

  const handleGetMyInfo = useCallback(async () => {
    const result = await cs.getSellerMyInfo();
    if (result?.errorCode === SUCCESS) {
      setUserInfo(result.data);
      //setUserAddress(result.data.rsGetUserAddressDTO);
    }
  });

  const handleLogout = () => {
    // utils.removeUserInfo();
    // utils.resetUserInfoSession();
    utils.removeLocalItem(STROAGE_USER_INFO);
    utils.removeSessionItem(STROAGE_USER_INFO);
    utils.removeSessionItem(STROAGE_TOKEN_ID);
    utils.removeSessionItem(STROAGE_REF_TOKEN_ID);
    utils.removeLocalItem(STROAGE_AUTO_LOGIN_KEY);
    moveLogin(true);
  };

  return { userInfo, handleGetMyInfo, handleLogout };
};

export default useAccount;
