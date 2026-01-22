'use client';

import { useRecoilState, useResetRecoilState } from 'recoil';
import {
  brandMenuState,
  headerMenuState,
  currentMenuState,
  listSecondCategoryState,
  listFirstCategoryState,
  listThirdCategoryState,
  selectedFirstCategoryState,
  selectedSecondCategoryState,
  selectedThirdCategoryState,
  listAllCategoryState,
} from '@/stores/menuRecoil';
import useLocale from './useLocale';
import thirdCategoryApi from '@/services/thirdCategoryApi';
import { useCallback, useEffect, useState } from 'react';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import firstCategoryApi from '@/services/firstCategoryApi';
import secondCategoryApi from '@/services/secondCategoryApi';
import utils from '@/utils';
import categoryApi from '@/services/categoryApi';
// import categoryApi from '@/services/categoryApi';

const useMenu = () => {
  const [listAllCategory, setListAllCategory] =
    useRecoilState(listAllCategoryState);

  const [listFirstCategory, setListFirstCategory] = useRecoilState(
    listFirstCategoryState,
  );
  const [listSecondCategory, setListSecondCategory] = useRecoilState(
    listSecondCategoryState,
  );
  const [listThirdCategory, setListThirdCategory] = useRecoilState(
    listThirdCategoryState,
  );

  const resetSelectedFirstCategory = useResetRecoilState(
    selectedFirstCategoryState,
  );
  const [selectedFirstCategory, setSelectedFirstCategory] = useRecoilState(
    selectedFirstCategoryState,
  );
  const resetSelectedSecondCategory = useResetRecoilState(
    selectedSecondCategoryState,
  );
  const [selectedSecondCategory, setSelectedSecondCategory] = useRecoilState(
    selectedSecondCategoryState,
  );
  const resetSelectedThirdCategory = useResetRecoilState(
    selectedThirdCategoryState,
  );
  const [selectedThirdCategory, setSelectedThirdCategory] = useRecoilState(
    selectedThirdCategoryState,
  );

  const initSelectCategory = useCallback(() => {
    console.log('initSelectCategory');
    resetSelectedFirstCategory();
    resetSelectedSecondCategory();
    resetSelectedThirdCategory();
  });

  const [currentMenu, setCurrentMenu] = useRecoilState(currentMenuState);
  const [headerMenu, setHeaderMenu] = useRecoilState(headerMenuState);
  const [brandMenu, setBrandMenu] = useRecoilState(brandMenuState);

  const handleAllCategory = async () => {
    const result = await categoryApi.getListCategory();
    if (result?.errorCode === SUCCESS) {
      setListAllCategory(result.firstCategoryDataList);
    }
  };

  const handleGetCategoryByName = useCallback(
    async (firstName, secondName, thirdName) => {
      if (firstName) {
        const firstInfo = listAllCategory.find((first) => {
          return (
            first.name.toLowerCase() ===
            decodeURIComponent(firstName.toLowerCase())
          );
        });
        if (firstInfo) {
          return firstInfo;
        } else {
          return null;
        }
      } else if (secondName) {
        let tempSecondInfo = null;
        for (let first of listAllCategory) {
          if (first?.secondCategoryDataList) {
            for (let second of first.secondCategoryDataList) {
              if (
                second.name.toLowerCase() ===
                decodeURIComponent(secondName.toLowerCase())
              ) {
                tempSecondInfo = second;
                break;
              }
            }
          }
          if (tempSecondInfo) break;
        }
        return tempSecondInfo;
      } else if (thirdName) {
        let tempThirdInfo = null;
        for (let first of listAllCategory) {
          if (first?.secondCategoryDataList) {
            for (let second of first.secondCategoryDataList) {
              if (second?.thirdCategoryDataList) {
                const thirdInfo = second.thirdCategoryDataList.find((third) => {
                  return (
                    third.name.toLowerCase() ===
                    decodeURIComponent(thirdName.toLowerCase())
                  );
                });
                if (thirdInfo) {
                  tempThirdInfo = thirdInfo;
                  break;
                }
              }
              if (tempThirdInfo) break;
            }
          }
          if (tempThirdInfo) break;
        }
        return tempThirdInfo;
      }
    },
  );

  const handleFindCategoryById = useCallback(
    async (firstCategoryId, secondCategoryId, thirdCategoryId) => {
      if (firstCategoryId) {
        const firstInfo = listAllCategory.find((first) => {
          return first.firstCategoryId === firstCategoryId;
        });
        if (firstInfo) {
          return firstInfo;
        } else {
          return null;
        }
      } else if (secondCategoryId) {
        let tempSecondInfo = null;
        for (let first of listAllCategory) {
          if (first?.secondCategoryDataList) {
            for (let second of first.secondCategoryDataList) {
              if (second.secondCategoryId === secondCategoryId) {
                tempSecondInfo = second;
                break;
              }
            }
          }
          if (tempSecondInfo) break;
        }
        return tempSecondInfo;
      } else if (thirdCategoryId) {
        let tempThirdInfo = null;
        for (let first of listAllCategory) {
          if (first?.secondCategoryDataList) {
            for (let second of first.secondCategoryDataList) {
              if (second?.thirdCategoryDataList) {
                const thirdInfo = second.thirdCategoryDataList.find((third) => {
                  return third.thirdCategoryId === thirdCategoryId;
                });
                if (thirdInfo) {
                  tempThirdInfo = thirdInfo;
                  break;
                }
              }
              if (tempThirdInfo) break;
            }
          }
          if (tempThirdInfo) break;
        }
        return tempThirdInfo;
      }
    },
  );

  const handleGetFirstCategory = useCallback(async () => {
    const result = await firstCategoryApi.getListFirstCategory();

    if (result?.errorCode === SUCCESS) {
      setListFirstCategory(result.datas);
      return result.datas;
    } else if (result?.errorCode === NO_DATA_ERROR) {
      return [];
    }
  });

  const handleGetSecondCategory = useCallback(async (firstCategoryId) => {
    const param = {
      firstCategoryId: firstCategoryId,
    };
    const result = await secondCategoryApi.getListSecondCategory(param);
    if (result?.errorCode === SUCCESS) {
      // setListSecondCategory(result.datas);
      return result.datas;
    } else if (result?.errorCode === NO_DATA_ERROR) {
      return [];
    }
  });

  const handleGetThirdCategory = useCallback(async (secondCategoryId) => {
    const param = {
      secondCategoryId,
    };
    const result = await thirdCategoryApi.getListThirdCategory(param);
    if (result?.errorCode === SUCCESS) {
      // setListThirdCategory(result.datas);
      return result.datas;
    } else if (result?.errorCode === NO_DATA_ERROR) {
      return [];
    }
  });

  return {
    listAllCategory,
    handleAllCategory,
    currentMenu,
    setCurrentMenu,
    headerMenu,
    setHeaderMenu,
    brandMenu,
    setBrandMenu,
    //
    handleGetFirstCategory,
    handleGetSecondCategory,
    handleGetThirdCategory,
    handleGetCategoryByName,
    handleFindCategoryById,
    //
    listFirstCategory,
    setListFirstCategory,
    listSecondCategory,
    setListSecondCategory,
    listThirdCategory,
    setListThirdCategory,
    //
    initSelectCategory,
    selectedFirstCategory,
    setSelectedFirstCategory,
    selectedSecondCategory,
    setSelectedSecondCategory,
    selectedThirdCategory,
    setSelectedThirdCategory,
  };
};

export default useMenu;
