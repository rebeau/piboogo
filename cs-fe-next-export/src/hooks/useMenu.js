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
import thirdCategoryApi from '@/services/thirdCategoryApi';
import { useCallback } from 'react';
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
    const result = await categoryApi.getCategory();
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
    let result = await firstCategoryApi.getListFirstCategory();
    if (utils.isLocalTest()) {
      result = {
        success: true,
        message: 'API가 정상 처리되었습니다',
        errorCode: 0,
        totalCount: 0,
        datas: [
          {
            name: 'Skincare',
            firstCategoryId: 1,
            idx: 1,
          },
          {
            name: 'Equipment',
            firstCategoryId: 2,
            idx: 2,
          },
          {
            name: 'Supplies',
            firstCategoryId: 3,
            idx: 3,
          },
          {
            name: 'Education',
            firstCategoryId: 4,
            idx: 4,
          },
        ],
      };
    }
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
    let result = await secondCategoryApi.getListSecondCategory(param);
    if (utils.isLocalTest()) {
      result = {
        success: true,
        message: 'API가 정상 처리되었습니다',
        errorCode: 0,
        totalCount: 0,
      };
      if (firstCategoryId === 1) {
        result.datas = [
          {
            name: 'Face',
            index: 1,
            secondCategoryId: 1,
          },
          {
            name: 'Body',
            index: 2,
            secondCategoryId: 2,
          },
          {
            name: 'Hair',
            index: 3,
            secondCategoryId: 3,
          },
        ];
      }
      if (firstCategoryId === 2) {
        result.datas = [
          {
            name: 'Facial & Body',
            index: 4,
            secondCategoryId: 4,
          },
          {
            name: 'ETC',
            index: 5,
            secondCategoryId: 5,
          },
        ];
      }
      if (firstCategoryId === 3) {
        result.datas = [
          {
            name: 'Tool',
            index: 6,
            secondCategoryId: 6,
          },
          {
            name: 'Furniture',
            index: 7,
            secondCategoryId: 7,
          },
        ];
      }
      if (firstCategoryId === 4) {
        result.datas = [
          {
            name: 'Education',
            index: 8,
            secondCategoryId: 8,
          },
          {
            name: 'Seminal',
            index: 9,
            secondCategoryId: 9,
          },
        ];
      }
    }
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
    let result = await thirdCategoryApi.getListThirdCategory(param);
    if (utils.isLocalTest()) {
      result = {
        success: true,
        message: 'API가 정상 처리되었습니다',
        errorCode: 0,
        totalCount: 0,
      };
      if (secondCategoryId === 1) {
        result.datas = [
          {
            name: 'Cleanser',
            index: 1,
            thirdCategoryId: 1,
          },
          {
            name: 'Toner & Mist',
            index: 2,
            thirdCategoryId: 2,
          },
          {
            name: 'Serum',
            index: 3,
            thirdCategoryId: 3,
          },
          {
            name: 'Ampoule',
            index: 4,
            thirdCategoryId: 4,
          },
          {
            name: 'Oil',
            index: 5,
            thirdCategoryId: 5,
          },
          {
            name: 'Cream',
            index: 6,
            thirdCategoryId: 6,
          },
          {
            name: 'Mask',
            index: 7,
            thirdCategoryId: 7,
          },
          {
            name: 'Sun Care',
            index: 8,
            thirdCategoryId: 8,
          },
          {
            name: 'BB Cream',
            index: 9,
            thirdCategoryId: 9,
          },
          {
            name: 'Cushion',
            index: 10,
            thirdCategoryId: 10,
          },
          {
            name: 'Peeling',
            index: 11,
            thirdCategoryId: 11,
          },
          {
            name: 'LIP',
            index: 12,
            thirdCategoryId: 12,
          },
          {
            name: 'KIT & Set',
            index: 13,
            thirdCategoryId: 13,
          },
        ];
      }
      if (secondCategoryId === 2) {
        result.datas = [
          {
            name: 'Body Cleanser',
            index: 1,
            thirdCategoryId: 14,
          },
          {
            name: 'Body Lotion',
            index: 1,
            thirdCategoryId: 15,
          },
          {
            name: 'Body Oil',
            index: 1,
            thirdCategoryId: 16,
          },
          {
            name: 'Body Scrub',
            index: 1,
            thirdCategoryId: 17,
          },
          {
            name: 'Massage Cream',
            index: 1,
            thirdCategoryId: 18,
          },

          {
            name: 'KIT & Set',
            index: 13,
            thirdCategoryId: 19,
          },
        ];
      }
      if (secondCategoryId === 3) {
        result.datas = [
          {
            name: 'Shampoo',
            index: 1,
            thirdCategoryId: 20,
          },
          {
            name: 'Treatment',
            index: 1,
            thirdCategoryId: 21,
          },
          {
            name: 'Hair MASK',
            index: 1,
            thirdCategoryId: 22,
          },
          {
            name: 'Hair Essence',
            index: 1,
            thirdCategoryId: 23,
          },
          {
            name: 'Scalp Essence',
            index: 1,
            thirdCategoryId: 24,
          },
        ];
      }
    }
    if (result?.errorCode === SUCCESS) {
      // setListThirdCategory(result.datas);
      return result.datas;
    } else if (result?.errorCode === NO_DATA_ERROR) {
      return [];
    }
  });

  const handleReindexCategories = (categories) => {
    // 첫 번째 계층부터 순차적으로 재정렬
    return categories.map((category, firstIndex) => {
      // firstCategory의 idx를 1부터 순차적으로 재정의
      category.idx = firstIndex + 1;

      // secondCategory 재정렬
      const sortedSecondCategories = category.secondCategoryDataList.map(
        (secondCategory, secondIndex) => {
          // secondCategory 내 thirdCategory 재정렬
          const sortedThirdCategories =
            secondCategory.thirdCategoryDataList.map(
              (thirdCategory, thirdIndex) => ({
                ...thirdCategory,
                idx: thirdIndex + 1, // thirdCategory의 idx를 1부터 순차적으로 설정
              }),
            );

          return {
            ...secondCategory,
            thirdCategoryDataList: sortedThirdCategories, // 재정렬된 thirdCategory
            idx: secondIndex + 1, // secondCategory의 idx를 1부터 순차적으로 설정
          };
        },
      );

      return {
        ...category,
        secondCategoryDataList: sortedSecondCategories, // 재정렬된 secondCategory
      };
    });
  };

  const handlePatchReIndexCategories = async (
    targetArr,
    firstCategoryId,
    secondCategoryId,
  ) => {
    if (secondCategoryId) {
      const firstCategory = targetArr.find((first) => {
        return first.firstCategoryId === Number(firstCategoryId);
      });
      if (firstCategory?.secondCategoryDataList) {
        const secondCategory = firstCategory.secondCategoryDataList.find(
          (first) => {
            return first.secondCategoryId === Number(secondCategoryId);
          },
        );
        if (secondCategory?.thirdCategoryDataList) {
          const reIdxThirdArr = secondCategory.thirdCategoryDataList.map(
            (category) => {
              return {
                thirdCategoryId: category.thirdCategoryId,
                idx: category.idx,
              };
            },
          );
          await thirdCategoryApi.patchThirdCategory(reIdxThirdArr);
        }
      }
    } else if (firstCategoryId) {
      const firstCategory = targetArr.find((first) => {
        return first.firstCategoryId === Number(firstCategoryId);
      });
      if (firstCategory?.secondCategoryDataList) {
        const reIdxSecondArr = firstCategory.secondCategoryDataList.map(
          (category) => {
            return {
              secondCategoryId: category.secondCategoryId,
              idx: category.idx,
            };
          },
        );
        await secondCategoryApi.patchSecondCategory(reIdxSecondArr);
      }
    } else {
      const reIdxFirstArr = targetArr.map((category) => {
        return {
          firstCategoryId: category.firstCategoryId,
          idx: category.idx,
        };
      });
      await firstCategoryApi.patchFirstCategory(reIdxFirstArr);
    }
  };

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
    handleReindexCategories,
    handlePatchReIndexCategories,
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
