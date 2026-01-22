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

const useAccount = () => {
  const { moveLogin } = useMove();
  const handleLogout = () => {
    utils.removeUserInfo();
    utils.resetUserInfoSession();
    moveLogin(true);
  };

  return { handleLogout };
};

export default useAccount;
