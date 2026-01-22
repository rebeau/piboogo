import { useResetRecoilState } from 'recoil';
import {
  STROAGE_AUTO_LOGIN_KEY,
  STROAGE_REF_TOKEN_ID,
  STROAGE_KEY,
  STROAGE_LOADING,
  STROAGE_USER_INFO,
  STROAGE_TOKEN_ID,
  STROAGE_ADMIN_AUTO_LOGIN_KEY,
  STROAGE_ADMIN_REF_TOKEN_ID,
  STROAGE_ADMIN_TOKEN_ID,
  STROAGE_ADMIN_USER_INFO,
} from '@/constants/common';
import utils from '@/utils';
import { tempAutoLoginState } from '@/stores/dataRecoil';
import { adminUserState, normalUserState } from '@/stores/userRecoil';
import { STROAGE_FCM_TOKEN_ID } from '@/constants/common';

const useSession = () => {
  const resetAdminUser = useResetRecoilState(adminUserState);
  const resetNormalUser = useResetRecoilState(normalUserState);
  const resetTempAutoLogin = useResetRecoilState(tempAutoLoginState);

  const removeCommon = () => {
    resetTempAutoLogin();
    utils.removeLocalItem(STROAGE_KEY);
    utils.removeLocalItem(STROAGE_LOADING);
  };

  const removeUserInfo = (isLogout = true) => {
    resetNormalUser();
    removeCommon();
    if (isLogout) {
      utils.setSnsInfo(null, null);
      utils.setMAutoLogin(false);
      utils.removeLocalItem(STROAGE_USER_INFO);
      utils.removeLocalItem(STROAGE_AUTO_LOGIN_KEY);
    }
    utils.removeLocalItem(STROAGE_TOKEN_ID);
    utils.removeSessionItem(STROAGE_TOKEN_ID);
    utils.removeLocalItem(STROAGE_REF_TOKEN_ID);
    utils.removeSessionItem(STROAGE_REF_TOKEN_ID);
    utils.removeSessionItem(STROAGE_FCM_TOKEN_ID);
  };

  const removeAdminUserInfo = (isLogout = true) => {
    resetAdminUser();
    removeCommon();
    if (isLogout) {
      utils.removeLocalItem(STROAGE_ADMIN_USER_INFO);
      utils.removeLocalItem(STROAGE_ADMIN_AUTO_LOGIN_KEY);
    }
    utils.removeLocalItem(STROAGE_ADMIN_TOKEN_ID);
    utils.removeSessionItem(STROAGE_ADMIN_TOKEN_ID);
    utils.removeLocalItem(STROAGE_ADMIN_REF_TOKEN_ID);
    utils.removeSessionItem(STROAGE_ADMIN_REF_TOKEN_ID);
  };

  return {
    removeUserInfo,
    removeAdminUserInfo,
  };
};

export default useSession;
