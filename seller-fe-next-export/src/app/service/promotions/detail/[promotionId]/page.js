'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Img,
  Select,
  Divider,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import utils from '@/utils';
import { DefaultPaginate } from '@/components';
import ContentDetailHeader from '@/components/custom/header/ContentDetailHeader';
import promotionApi from '@/services/promotionApi';
import { SUCCESS } from '@/constants/errorCode';
import productApi from '@/services/productApi';
import useStatus from '@/hooks/useStatus';
import useAccount from '@/hooks/useAccount';
import { LIST_CONTENT_NUM } from '@/constants/common';
import useMove from '@/hooks/useMove';
import { normalUserState } from '@/stores/userRecoil';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useModal from '@/hooks/useModal';
import { selectedPromotionState } from '@/stores/dataRecoil';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import useDevice from '@/hooks/useDevice';
import IconEdit from '@public/svgs/icon/lounge-pen.svg';
import IconDelete from '@public/svgs/icon/lounge-delete.svg';
import promotionProductApi from '@/services/promotionProductApi';

const PromotionsDetailPage = () => {
  const { isMobile, clampW } = useDevice();
  const userInfo = useRecoilValue(normalUserState);
  const setSelectedPromotion = useSetRecoilState(selectedPromotionState);
  const { promotionId } = useParams();
  const { moveProductDetail, moveBack, movePromotionModify } = useMove();
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();
  const {
    handleGetAuthStatus,
    handleGetProductSalesStatus,
    handleGetAccessStatus,
  } = useStatus();

  const [promotionInfo, setPromotionInfo] = useState({});

  const [isInitList, setIsInitList] = useState(true);
  const [period, setPeriod] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const key = 'productId';
  const [listProduct, setListProduct] = useState([]);

  // 프로모션 관련
  useEffect(() => {
    if (utils.isNotEmpty(promotionId)) {
      handleGetPromotion();
      handleGetListPromotionProduct();
    } else {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_POST),
        onAgree: () => {
          moveBack();
        },
      });
    }
  }, [promotionId]);

  const handleGetPromotion = async () => {
    const param = {
      promotionId: promotionId,
    };
    const result = await promotionApi.getPromotion(param);

    if (result?.errorCode === SUCCESS) {
      const promotionInfo = result.data;
      setPromotionInfo(promotionInfo);
      if (promotionInfo.startDate && promotionInfo.endDate) {
        setPeriod(
          `${utils.parseDateByCountryCode(promotionInfo.startDate, lang)} - ${utils.parseDateByCountryCode(promotionInfo.endDate, lang)}`,
        );
      } else {
        setPeriod(localeText(LANGUAGES.COMMON.UNLIMITED));
      }
    }
  };

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item[key]);
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item[key]),
    );
    return newDatas;
  };

  const handleGetListPromotionProduct = useCallback(async () => {
    const param = {
      promotionId: Number(promotionId),
    };
    const result = await promotionProductApi.getListPromotionProduct(param);
    setIsInitList(false);
    if (result?.errorCode === SUCCESS) {
      if (isMobile(true)) {
        setListProduct((prev) => {
          const newDatas = getNewDatas(
            result.datas,
            listProduct,
            currentPage,
            contentNum,
          );
          return [...prev, ...newDatas];
        });
      } else {
        setListProduct(result.datas);
      }
      setTotalCount(result.totalCount);
    } else {
      if (isMobile(true)) {
        setListProduct((prev) => [...prev, ...[]]);
      } else {
        setListProduct([]);
      }
      setTotalCount(result.totalCount);
    }
  });

  const handleDeletePromotion = async () => {
    const param = {
      promotionIds: [promotionId],
    };
    const result = await promotionApi.deletePromotion(param);

    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  };

  const handleGetAccess = useCallback(
    (accessLevel) => {
      const tempAccessLevel = accessLevel || promotionInfo.accessLevel;
      if (!tempAccessLevel) return;
      // 1:제한없음, 2:브론즈회원, 3:골드회원, 4:플레티넘회원
      // 5:브론즈회원&골드회원, 6:브론즈회원&플레티넘회원, 7: 골드회원&플레티넘회원)
      if (tempAccessLevel === 1) {
        return {
          access: localeText(LANGUAGES.PROMOTIONS.NO_RESTRICTIONS),
          level: null,
        };
      }

      const accessLevelValue = handleGetAccessStatus(tempAccessLevel);
      return {
        access: localeText(LANGUAGES.PROMOTIONS.RESTRICTED_ACCESS),
        level: accessLevelValue,
      };
    },
    [promotionInfo],
  );

  const productCard = useCallback((item, index) => {
    const productId = item?.productId || 1;
    const name = item?.name || '';
    const brandName = userInfo?.brandName || '';
    const status = item?.status || 1;
    const msrp = item?.msrp || 20;
    const wp = item?.wp || 15;
    const stockCnt = item?.stockCnt || 100;
    const thirdCategoryName = item?.thirdCategoryName || '';
    const firstCategoryName = item?.firstCategoryName || '';
    const secondCategoryName = item?.secondCategoryName || '';
    const cartCnt = item?.cartCnt || 0;
    const favoritesCnt = item?.favoritesCnt || 0;
    const viewCnt = item?.viewCnt || 0;

    const productImageList = item?.productImageList || [];

    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

    return isMobile(true) ? (
      <Box
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderTop={'1px solid #73829D'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
        onClick={() => {
          moveProductDetail(productId);
        }}
      >
        <VStack>
          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Center w={clampW(5, 6.25)} h={clampW(5, 6.25)}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    objectFit={'cover'}
                    src={firstImageSrc}
                  />
                </Center>
              </Box>
              <Box>
                <VStack spacing={'0.5rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9357rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {name}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'0.25rem'} alignItems={'center'}>
                      <Text
                        color={'#66809C'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                        opacity={'0.7'}
                      >
                        {firstCategoryName}
                      </Text>
                      {secondCategoryName && (
                        <>
                          <Center w={'1rem'} h={'1rem'}>
                            <Img h={'100%'} src={IconRight.src} />
                          </Center>
                          <Text
                            color={'#485766'}
                            fontSize={'0.875rem'}
                            fontWeight={400}
                            lineHeight={'1.4rem'}
                            opacity={'0.7'}
                          >
                            {secondCategoryName}
                          </Text>
                        </>
                      )}
                      {thirdCategoryName && (
                        <>
                          <Center w={'1rem'} h={'1rem'}>
                            <Img h={'100%'} src={IconRight.src} />
                          </Center>
                          <Text
                            color={'#485766'}
                            fontSize={'0.875rem'}
                            fontWeight={400}
                            lineHeight={'1.4rem'}
                            opacity={'0.7'}
                          >
                            {thirdCategoryName}
                          </Text>
                        </>
                      )}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.ORDER)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.getPageContentNum(
                    index,
                    currentPage,
                    totalCount,
                    contentNum,
                  )}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.BRAND)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {brandName}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PRODUCTS.SALES_AMOUNT)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(wp)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PRODUCTS.MSRP)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(msrp)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PRODUCTS.STATE)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {handleGetProductSalesStatus(status)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.INVENTORY)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseAmount(cartCnt)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 6.25)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PRODUCTS.VIEW)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseAmount(viewCnt)}
                </Text>
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>
    ) : (
      <Box
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Box w={'5rem'}>
            <Text
              textAlign={'center'}
              color={'#2A333C'}
              fontSize={'0.9357rem'}
              fontWeight={500}
              lineHeight={'1.5rem'}
            >
              {utils.getPageContentNum(
                index,
                currentPage,
                totalCount,
                contentNum,
              )}
            </Text>
          </Box>
          <Box w={'8.25rem'}>
            <Text
              textAlign={'center'}
              color={'#2A333C'}
              fontSize={'0.9357rem'}
              fontWeight={500}
              lineHeight={'1.5rem'}
            >
              {brandName}
            </Text>
          </Box>
          <Box
            w={'18.9375rem'}
            onClick={() => {
              moveProductDetail(productId);
            }}
            cursor={'pointer'}
          >
            <HStack spacing={'0.75rem'}>
              <Center w={'5rem'} h={'5rem'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={firstImageSrc}
                />
              </Center>
              <Box>
                <VStack spacing={'0.5rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9357rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {item.name}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'0.25rem'} alignItems={'center'}>
                      <Text
                        color={'#66809C'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                        opacity={'0.7'}
                      >
                        {firstCategoryName}
                      </Text>
                      {secondCategoryName && (
                        <>
                          <Center w={'1rem'} h={'1rem'}>
                            <Img h={'100%'} src={IconRight.src} />
                          </Center>
                          <Text
                            color={'#485766'}
                            fontSize={'0.875rem'}
                            fontWeight={400}
                            lineHeight={'1.4rem'}
                            opacity={'0.7'}
                          >
                            {secondCategoryName}
                          </Text>
                        </>
                      )}
                      {thirdCategoryName && (
                        <>
                          <Center w={'1rem'} h={'1rem'}>
                            <Img h={'100%'} src={IconRight.src} />
                          </Center>
                          <Text
                            color={'#485766'}
                            fontSize={'0.875rem'}
                            fontWeight={400}
                            lineHeight={'1.4rem'}
                            opacity={'0.7'}
                          >
                            {thirdCategoryName}
                          </Text>
                        </>
                      )}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>
          <Box w={'6.6625rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(wp)}
            </Text>
          </Box>
          <Box w={'6.6625rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(msrp)}
            </Text>
          </Box>
          <Box w={'6.6625rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {handleGetProductSalesStatus(status)}
            </Text>
          </Box>
          <Box w={'6.6625rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseAmount(cartCnt)}
            </Text>
          </Box>
          <Box w={'6.6625rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseAmount(viewCnt)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'0.44rem'}>
            <Center
              w={clampW(1.875, 2)}
              minW={clampW(1.875, 2)}
              h={clampW(1.875, 2)}
              onClick={() => {
                if (promotionInfo.status === 3) {
                  openModal({
                    text: localeText(LANGUAGES.INFO_MSG.MODIFY_PROMOTION_MSG),
                  });
                  return;
                }
                const temp = {
                  ...promotionInfo,
                  promotionId: promotionId,
                };
                setSelectedPromotion(temp);
                movePromotionModify();
              }}
            >
              <Img src={IconEdit.src} />
            </Center>
            <Center
              w={clampW(1.875, 2)}
              minW={clampW(1.875, 2)}
              h={clampW(1.875, 2)}
              onClick={() => {
                if (promotionInfo.status === 3) {
                  openModal({
                    text: localeText(LANGUAGES.INFO_MSG.MODIFY_PROMOTION_MSG),
                  });
                  return;
                }
                setTimeout(() => {
                  openModal({
                    type: 'confirm',
                    text: localeText(LANGUAGES.INFO_MSG.DELETE_PROMOTION_MSG),
                    onAgree: () => {
                      handleDeletePromotion();
                    },
                  });
                });
              }}
            >
              <Img src={IconDelete.src} />
            </Center>
          </HStack>
        </Box>
      }
    >
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'} px={clampW(1, 5)}>
          <Box w={'100%'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={clampW(12.5, 9.25)}>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.AUTHORIZATION)}
                    </Text>
                  </Box>
                  <Box minW={'9.25rem'}>
                    <Text
                      color={
                        promotionInfo.status === 1 || promotionInfo.status === 3
                          ? '#485766'
                          : '#B20000'
                      }
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {handleGetAuthStatus(promotionInfo.status)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={clampW(12.5, 9.25)}>
                    <Text
                      w={'100%'}
                      color={'#7895B2'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      overflow={'auto'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.SHOW_MAIN_SCREEN_OR_NOT)}
                    </Text>
                  </Box>
                  <Box minW={'9.25rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {promotionInfo.isMainIncluded === 1
                        ? localeText(LANGUAGES.PROMOTIONS.UNEXPOSED)
                        : localeText(LANGUAGES.PROMOTIONS.EXPOSURE)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={clampW(12.5, 9.25)}>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.BANNERS.PERIOD)}
                    </Text>
                  </Box>
                  <Box minW={'9.25rem'}>
                    <Text
                      color={'#485766'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {period}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={clampW(12.5, 9.25)}>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.DATE_REQUEST)}
                    </Text>
                  </Box>
                  <Box minW={'9.25rem'}>
                    <Text
                      color={'#485766'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {utils.parseDateByCountryCode(
                        promotionInfo.createdAt,
                        lang,
                        true,
                      )}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  spacing={'2rem'}
                >
                  <Box w={clampW(12.5, 9.25)}>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.RESTRICT_ACCESS)}
                    </Text>
                  </Box>
                  <Box minW={'9.25rem'}>
                    <HStack spacing={'0.75rem'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={clampW(0.875, 0.9375)}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        {handleGetAccess(promotionInfo.accessLevel)?.access}
                      </Text>
                      {promotionInfo?.accessLevel > 1 && (
                        <>
                          <Divider
                            w={'1px'}
                            h={'1rem'}
                            borderRight={'2px solid #A7C3D2'}
                          />
                          <Text
                            color={'#556A7E'}
                            fontSize={clampW(0.875, 0.9375)}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {handleGetAccess(promotionInfo.accessLevel)?.level}
                          </Text>
                        </>
                      )}
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  spacing={'2rem'}
                >
                  <Box w={clampW(12.5, 9.25)}>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.PROMOTION_TITLE)}
                    </Text>
                  </Box>
                  <Box minW={'9.25rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {promotionInfo.name}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <Wrap spacingX={'2.5rem'}>
                  <WrapItem w={clampW(12.5, 9.25)}>
                    <Box w={'100%'} minW={'100%'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={clampW(0.875, 0.9375)}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.PROMOTIONS.PROMOTION_CONTENTS)}
                      </Text>
                    </Box>
                  </WrapItem>
                  <WrapItem w={clampW(30, 60)}>
                    <Box>
                      <Text
                        color={'#556A7E'}
                        fontSize={clampW(0.875, 0.9375)}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                        whiteSpace={'pre-wrap'}
                      >
                        {promotionInfo.content}
                      </Text>
                    </Box>
                  </WrapItem>
                </Wrap>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#7895B2'}
                  fontSize={clampW(0.875, 0.9375)}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.REPRESENTATIVE_IMAGE)}
                </Text>
              </Box>
              <Box
                w={'100%'}
                h={'auto'}
                aspectRatio={1920 / 560}
                overflowY={'hidden'}
              >
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={promotionInfo.imageS3Url}
                />
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.RELATED_PRODUCT)}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </VStack>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'} px={clampW(1, 5)}>
          <VStack spacing={'0.75rem'}>
            <Box w={'100%'}>
              <VStack spacing={0}>
                {listProduct.map((item, index) => {
                  return productCard(item, index);
                })}
                {listProduct.length === 0 && (
                  <Center w={'100%'} h={'10rem'}>
                    <Text
                      fontSize={'1.5rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                    </Text>
                  </Center>
                )}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>
    </MainContainer>
  ) : (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'0.75rem'}>
            <Box minW={'7rem'} h={'3rem'}>
              <Button
                onClick={() => {
                  if (promotionInfo.status === 3) {
                    openModal({
                      text: localeText(LANGUAGES.INFO_MSG.MODIFY_PROMOTION_MSG),
                    });
                    return;
                  }
                  const temp = {
                    ...promotionInfo,
                    promotionId: promotionId,
                  };
                  setSelectedPromotion(temp);
                  movePromotionModify();
                }}
                px={'1.25rem'}
                py={'0.63rem'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
                h={'100%'}
                w={'100%'}
                _disabled={{
                  bg: '#7895B290',
                }}
                _hover={{
                  opacity: 0.8,
                }}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.COMMON.MODIFY)}
                </Text>
              </Button>
            </Box>
            <Box minW={'7rem'} h={'3rem'}>
              <Button
                onClick={() => {
                  if (promotionInfo.status === 3) {
                    openModal({
                      text: localeText(LANGUAGES.INFO_MSG.MODIFY_PROMOTION_MSG),
                    });
                    return;
                  }
                  setTimeout(() => {
                    openModal({
                      type: 'confirm',
                      text: localeText(LANGUAGES.INFO_MSG.DELETE_PROMOTION_MSG),
                      onAgree: () => {
                        handleDeletePromotion();
                      },
                    });
                  });
                }}
                px={'1.25rem'}
                py={'0.63rem'}
                borderRadius={'0.25rem'}
                border={'1px solid #B20000'}
                boxSizing={'border-box'}
                bg={'transparent'}
                h={'100%'}
                w={'100%'}
                _disabled={{
                  bg: '#7895B290',
                }}
                _hover={{
                  opacity: 0.8,
                }}
              >
                <Text
                  color={'#B20000'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.COMMON.DELETE)}
                </Text>
              </Button>
            </Box>
          </HStack>
        </Box>
      }
    >
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'}>
          <Box w={'100%'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.AUTHORIZATION)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={
                        promotionInfo.status === 1 || promotionInfo.status === 3
                          ? '#485766'
                          : '#B20000'
                      }
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {handleGetAuthStatus(promotionInfo.status)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.SHOW_MAIN_SCREEN_OR_NOT)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {promotionInfo.isMainIncluded === 1
                        ? localeText(LANGUAGES.PROMOTIONS.UNEXPOSED)
                        : localeText(LANGUAGES.PROMOTIONS.EXPOSURE)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.BANNERS.PERIOD)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {period}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.DATE_REQUEST)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {utils.parseDateByCountryCode(
                        promotionInfo.createdAt,
                        lang,
                        true,
                      )}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.RESTRICT_ACCESS)}
                    </Text>
                  </Box>
                  <Box>
                    <HStack spacing={'0.75rem'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        {handleGetAccess(promotionId.accessLevel)?.access}
                      </Text>
                      {promotionInfo?.accessLevel > 1 && (
                        <>
                          <Divider
                            w={'1px'}
                            h={'1rem'}
                            borderRight={'2px solid #A7C3D2'}
                          />
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {handleGetAccess(promotionId.accessLevel)?.level}
                          </Text>
                        </>
                      )}
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.PROMOTION_TITLE)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {promotionInfo.name}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  spacing={'2rem'}
                >
                  <Box w={'12.5rem'} minW={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.PROMOTION_CONTENTS)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {promotionInfo.content}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.REPRESENTATIVE_IMAGE)}
                </Text>
              </Box>
              <Box w={'100%'} aspectRatio={2.6667}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={promotionInfo.imageS3Url}
                />
              </Box>
            </VStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.RELATED_PRODUCT)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <VStack spacing={0}>
                  <Box
                    w={'100%'}
                    borderTop={'1px solid #73829D'}
                    borderBottom={'1px solid #73829D'}
                    px={'1rem'}
                    py={'0.75rem'}
                    boxSizing={'border-box'}
                  >
                    <HStack spacing={'0.75rem'}>
                      <Box w={'5rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PROMOTIONS.ORDER)}
                        </Text>
                      </Box>
                      <Box w={'8.25rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PROMOTIONS.BRAND)}
                        </Text>
                      </Box>
                      <Box w={'18.9375rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                        </Text>
                      </Box>
                      <Box w={'6.6625rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.SALES_AMOUNT)}
                        </Text>
                      </Box>
                      <Box w={'6.6625rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.MSRP)}
                        </Text>
                      </Box>
                      <Box w={'6.6625rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.STATE)}
                        </Text>
                      </Box>
                      <Box w={'6.6625rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PROMOTIONS.INVENTORY)}
                        </Text>
                      </Box>
                      <Box w={'6.6625rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.VIEW)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={0}>
                      {listProduct.map((item, index) => {
                        return productCard(item, index);
                      })}
                      {listProduct.length === 0 && (
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                          </Text>
                        </Center>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  );
};

export default PromotionsDetailPage;
