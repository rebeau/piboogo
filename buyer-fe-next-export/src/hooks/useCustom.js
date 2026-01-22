'use client';

import { useCallback } from 'react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from './useLocale';
import buyerApi from '@/services/buyerUserApi';
import { SUCCESS } from '@/constants/errorCode';

const useCustom = () => {
  const { localeText } = useLocale();

  const getGrade = useCallback((grade) => {
    switch (Number(grade)) {
      case 1:
        return localeText(LANGUAGES.COMMON.BRONZE);
      case 2:
        return localeText(LANGUAGES.COMMON.GOLD);
      case 3:
        return localeText(LANGUAGES.COMMON.PLATINUM);
      default:
        '';
        break;
    }
  });

  const getMyInfo = useCallback(async () => {
    const result = await buyerApi.getBuyerMyInfo();
    if (result?.errorCode === SUCCESS) {
      const tempAddress = { ...result.data.rsGetUserAddressDTO };
      return {
        userInfo: result.data,
        addressInfo: tempAddress,
      };
    }
  });

  return {
    getGrade,
    getMyInfo,
  };
};

export default useCustom;
