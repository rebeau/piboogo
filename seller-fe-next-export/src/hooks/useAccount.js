'use client';

import { SUCCESS } from '@/constants/errorCode';
import { SERVICE } from '@/constants/pageURL';
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

  const [userInfo, setUserInfo] = useRecoilState(normalUserState);

  const listCheckPath = [SERVICE.PRODUCTS.ROOT];

  useEffect(() => {
    const isLogin = utils.getIsLogin();
    const isRequireInfo = handleCheckPath();
    if (isLogin) {
      if (utils.isEmpty(userInfo)) {
        handleGetMyInfo();
      } else {
        if (utils.isLocalTest()) {
          console.log('userInfo', userInfo);
        }
      }
    } else {
      if (isRequireInfo) {
        console.log('로그인이 필요한 서비스임');
        moveLogin(true);
      }
    }
  }, []);

  const handleCheckPath = () => {
    let isCheck = false;
    for (let arrIndex = 0; arrIndex < listCheckPath.length; arrIndex++) {
      if (pathName.indexOf(listCheckPath[arrIndex]) !== -1) {
        // pathName에 arr[arrIndex]가 포함된 경우
        return true; // true 반환 후 for문 탈출
      }
    }
    return isCheck;
  };

  const handleGetMyInfo = useCallback(async () => {
    const result = await sellerUserApi.getSellerMyInfo();
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
