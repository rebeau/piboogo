import { useRecoilState, useResetRecoilState } from 'recoil';
import { useCallback, useState } from 'react';
import utils from '@/utils';
import { tempAutoLoginState } from '@/stores/dataRecoil';
import useModal from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import { ADMIN } from '@/constants/pageURL';
import { adminUserState } from '@/stores/userRecoil';
import useSession from '@/hooks/useSession';
import adminUserApi from '@/services/adminUserApi';
import { REQUIRE_SIGNUP_ERROR, SUCCESS } from '@/constants/errorCode';
import {
  STROAGE_ADMIN_AUTO_LOGIN_KEY,
  STROAGE_ADMIN_USER_INFO,
} from '@/constants/common';
import normalUserApi from '@/services/normalUserApi';
import { normalUserState, tempSnsInfoState } from '@/stores/userRecoil';
import { MAIN } from '@/constants/pageURL';

const useSign = () => {
  const [isWithDraw, setIsWithDraw] = useState(false);
  const router = useRouter();
  const { removeUserInfo } = useSession();
  const { openModal } = useModal();

  const { removeAdminUserInfo } = useSession();
  const [tempAutoLogin, setTempAutoLogin] = useRecoilState(tempAutoLoginState);

  const resetAdminUserState = useResetRecoilState(adminUserState);
  const [adminUser, setAdminUser] = useRecoilState(adminUserState);

  const resetNormalUserState = useResetRecoilState(normalUserState);
  const [normalUser, setNormalUser] = useRecoilState(normalUserState);

  const resetTempSnsInfo = useResetRecoilState(tempSnsInfoState);
  const [tempSnsInfo, setTempSnsInfo] = useRecoilState(tempSnsInfoState);

  const logoutProcess = useCallback(async (massage) => {
    setTimeout(() => {
      openModal({
        text: massage || '로그아웃 되었습니다.',
        onAgree: () => {
          removeAdminUserInfo();
          router.replace(ADMIN.login);
        },
      });
    });
  });

  const normalUserLogoutProcess = useCallback(async () => {
    setTimeout(() => {
      openModal({
        text: isWithDraw ? '감사합니다.' : '로그아웃 되었습니다.',
        onAgree: () => {
          normalUserLogout();
        },
      });
    });
  });

  const handleExLogout = () => {
    const snsType = tempSnsInfo?.snsType || normalUser?.snsType || null;
    if (snsType) {
      utils.exLogout(snsType);
    }
  };

  const normalUserLogout = () => {
    handleExLogout();
    removeUserInfo();
    router.replace(MAIN.login);
  };

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

  const getAdminUserLogin = useCallback(async (data) => {
    const param = {
      id: data.id,
      pw: data.pw,
    };
    const result = await adminUserApi.getAdminUserLogin(param);
    if (result.errorCode === SUCCESS) {
      utils.setAdminAutoLogin(tempAutoLogin);
      if (utils.getAdminAutoLogin()) {
        utils.setAdminUserInfo(data.id, data.pw);
      } else {
        utils.removeLocalItem(STROAGE_ADMIN_USER_INFO);
        utils.removeLocalItem(STROAGE_ADMIN_AUTO_LOGIN_KEY);
      }
      utils.setAdminAccessToken(result.data.accessToken);
      utils.setAdminRefreshToken(result.data.refreshToken);
      setAdminUser({
        ...adminUser,
        isLogin: true,
        isAdmin: true,
        id: data.id,
        adminUserId: result.data.adminUserId,
      });
      return true;
    } else {
      openModal({ text: result.message });
    }
    return false;
  });

  const getNormalUserLogin = useCallback(async (data) => {
    const param = {
      snsToken: data.snsToken,
      snsType: data.snsType,
    };
    if (data?.fcmToken) {
      param.fcmToken = data.fcmToken;
    }
    const result = await normalUserApi.getNormalUserLogin(param);
    if (result.errorCode === SUCCESS) {
      utils.setAccessToken(result.data.accessToken);
      utils.setRefreshToken(result.data.refreshToken);
      utils.setSnsInfo(data.snsToken, data.snsType);
    } else if (result.errorCode === REQUIRE_SIGNUP_ERROR) {
      utils.setSnsInfo(data.snsToken, data.snsType);
      setTempSnsInfo({
        snsToken: data.snsToken,
        snsType: data.snsType,
        fcmToken: data?.fcmToken || '',
      });
      setTimeout(() => {
        openModal({
          text: '회원가입이 필요합니다.\n회원가입 화면으로 이동 됩니다.',
          onAgree: () => {
            router.push(MAIN.join);
          },
        });
      });
    }
    return result;
  });

  const getNormalUsercheckNickName = useCallback(async (data) => {
    const param = {
      nickName: data.nickName,
    };
    const result = await normalUserApi.getNormalUsercheckNickName(param);
    if (result.errorCode === SUCCESS) {
      return result;
    } else {
      return false;
    }
  });

  const postNormalUserSignUp = useCallback(async (nickName) => {
    const { snsToken, snsType, fcmToken } = tempSnsInfo;
    const param = {
      snsToken,
      snsType,
      nickName,
    };
    if (fcmToken) {
      param.fcmToken = fcmToken;
    }
    const result = await normalUserApi.postNormalUserSignUp(param);
    if (result.errorCode === SUCCESS) {
      utils.setMAutoLogin(tempAutoLogin);
      const param = {
        snsToken,
        snsType,
      };
      if (fcmToken) {
        param.fcmToken = fcmToken;
      }
      const resultLogin = await getNormalUserLogin(param);
      if (resultLogin.errorCode === SUCCESS) {
        return true;
      }
    }
    return false;
  });

  const deleteNormalUser = useCallback(async () => {
    setIsWithDraw(true);
    const result = await normalUserApi.deleteNormalUser();
    if (result.errorCode === SUCCESS) {
      normalUserLogoutProcess();
    }
  });

  return {
    tempAutoLogin,
    setTempAutoLogin,
    adminUser,
    setAdminUser,
    tempSnsInfo,
    setTempSnsInfo,
    normalUser,
    setNormalUser,
    logoutProcess,
    handleExLogout,
    normalUserLogout,
    normalUserLogoutProcess,
    getAdminUserLogin,
    resetAdminUserState,
    getNormalUserLogin,
    getNormalUsercheckNickName,
    postNormalUserSignUp,
    deleteNormalUser,
  };
};

export default useSign;
