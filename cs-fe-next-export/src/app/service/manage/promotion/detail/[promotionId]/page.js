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
  Divider,
  RadioGroup,
  Radio,
  Select,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import utils from '@/utils';
import ContentBR from '@/components/common/ContentBR';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import promotionApi from '@/services/promotionApi';
import MainContainer from '@/components/layout/MainContainer';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import useStatus from '@/hooks/useStatus';
import { LIST_CONTENT_NUM } from '@/constants/common';
import promotionProductApi from '@/services/promotionProductApi';

const PromotionsDetailPage = () => {
  const router = useRouter();
  const { promotionId } = useParams();
  const { openModal } = useModal();
  const { moveBack, moveProductDetail } = useMove();
  const { lang, localeText } = useLocale();
  const { handleGetProductSalesStatus, handleGetAccessStatus } = useStatus();
  const [promotionInfo, setPromotionInfo] = useState({});

  const [period, setPeriod] = useState('');
  const [status, setStatus] = useState(0);
  const [mainIndex, setMainIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [listProduct, setListProduct] = useState([]);

  const [promotionIndex, setPromotionIndex] = useState(0);
  const [isMainIncluded, setIsMainIncluded] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  const [isAccess, setIsAccess] = useState(false);
  const [isPlatinum, setIsPlatinum] = useState(false);
  const [isGold, setIsGold] = useState(false);
  const [isBronze, setIsBronze] = useState(false);

  useEffect(() => {
    if (utils.isNotEmpty(promotionId)) {
      handleGetPromotion();
      handleGetListPromotionProduct();
      handleGetPromotionIndex();
    } else {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_POST),
        onAgree: () => {
          moveBack();
        },
      });
    }
  }, [promotionId]);

  useEffect(() => {
    if (isPlatinum || isGold || isBronze) {
      setIsAccess(false);
    } else {
      setIsAccess(true);
    }
  }, [isPlatinum, isGold, isBronze]);

  useEffect(() => {
    if (accessLevel) {
      if (accessLevel === 1) {
        setIsPlatinum(false);
        setIsGold(false);
        setIsBronze(false);
      } else if (accessLevel === 2) {
        setIsPlatinum(false);
        setIsGold(false);
        setIsBronze(true);
      } else if (accessLevel === 3) {
        setIsPlatinum(false);
        setIsGold(true);
        setIsBronze(false);
      } else if (accessLevel === 4) {
        setIsPlatinum(true);
        setIsGold(false);
        setIsBronze(false);
      } else if (accessLevel === 5) {
        setIsPlatinum(false);
        setIsGold(true);
        setIsBronze(true);
      } else if (accessLevel === 6) {
        setIsPlatinum(true);
        setIsGold(false);
        setIsBronze(true);
      } else if (accessLevel === 7) {
        setIsPlatinum(true);
        setIsGold(true);
        setIsBronze(false);
      }
    }
  }, [accessLevel]);

  const handleGetPromotion = async () => {
    const param = {
      promotionId: promotionId,
    };

    const result = await promotionApi.getPromotion(param);
    if (result?.errorCode === SUCCESS) {
      const promotionInfo = result.data;
      setPromotionInfo(promotionInfo);
      setStatus(promotionInfo.status);
      setIsMainIncluded(promotionInfo.isMainIncluded === 1 ? false : true);
      setAccessLevel(promotionInfo.accessLevel);
      setMainIndex(promotionInfo.mainIdx);
      if (promotionInfo.startDate && promotionInfo.endDate) {
        setPeriod(
          `${utils.parseDateByCountryCode(promotionInfo.startDate, lang)} - ${utils.parseDateByCountryCode(promotionInfo.endDate, lang)}`,
        );
      } else {
        setPeriod(localeText(LANGUAGES.COMMON.UNLIMITED));
      }
    } else {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  };

  const handleGetListPromotionProduct = useCallback(async () => {
    const param = {
      promotionId: Number(promotionId),
    };
    const result = await promotionProductApi.getListPromotionProduct(param);
    if (result?.errorCode === SUCCESS) {
      setListProduct(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListProduct([]);
      setTotalCount(result.totalCount);
    }
  });

  const handleGetPromotionIndex = useCallback(async () => {
    const result = await promotionApi.getPromotionMaxMainIdx();
    if (result?.errorCode === SUCCESS) {
      const maxMainIdx = result.data.maxMainIdx;
      setPromotionIndex(maxMainIdx);
    } else {
      setPromotionIndex(0);
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

  const handleModifyPromotion = async () => {
    if (
      status === 3 &&
      isMainIncluded === true &&
      (utils.isEmpty(mainIndex) || mainIndex === 0)
    ) {
      openModal({ text: localeText(LANGUAGES.PROMOTION.CHOOSE_THE_ORDER) });
      return;
    }
    const param = {
      promotionId: promotionId,
      status: status,
    };
    if (isMainIncluded === true && status === 3) {
      param.isMainIncluded = 2;
      param.mainIdx = mainIndex;
    } else {
      param.isMainIncluded = 1;
    }
    if (
      isAccess === true ||
      (isPlatinum === true && isGold === true && isBronze === true)
    ) {
      param.accessLevel = 1;
    } else if (isPlatinum === true && isGold === true) {
      param.accessLevel = 7;
    } else if (isBronze === true && isPlatinum === true) {
      param.accessLevel = 6;
    } else if (isBronze === true && isGold === true) {
      param.accessLevel = 5;
    } else if (isPlatinum === true) {
      param.accessLevel = 4;
    } else if (isGold === true) {
      param.accessLevel = 3;
    } else if (isBronze === true) {
      param.accessLevel = 2;
    }

    const result = await promotionApi.patchPromotion(param);
    openModal({
      text: result.message,
      onAgree: () => {
        if (result?.errorCode === SUCCESS) {
          //
        }
      },
    });
  };

  const handleGetAccess = useCallback(
    (accessLevel) => {
      const tempAccessLevel = accessLevel || promotionInfo.accessLevel;
      if (!tempAccessLevel) return;
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

  const handleMember = () => {
    console.log('handleMember');
  };

  const productCard = useCallback((item, index) => {
    const productId = item?.productId || 1;
    const name = item?.name || '';
    const brandName = item?.brandName || '';
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

    return (
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

  return (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'2.5rem'} alignItems={'center'}>
            <Box>
              <HStack
                justifyContent={'flex-end'}
                alignItems={'center'}
                spacing={'1.5rem'}
              >
                <Text
                  w={'10.3125rem'}
                  minW={'10.3125rem'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PROMOTION.PROMOTION_PERMISSION)}
                </Text>
                <RadioGroup
                  w={'100%'}
                  value={status}
                  onChange={(value) => {
                    setStatus(Number(value));
                  }}
                >
                  <HStack spacing={'1.5rem'} alignItems={'center'}>
                    <Box>
                      <HStack alignItems={'center'} spacing={'0.5rem'}>
                        <Radio value={3} />
                        <Box w={'5.375rem'}>
                          <Text
                            textAlign={'left'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.STATUS.AUTHORIZED)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box>
                      <HStack alignItems={'center'} spacing={'0.5rem'}>
                        <Radio value={2} />
                        <Box w={'6.6875rem'}>
                          <Text
                            textAlign={'left'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.STATUS.UNAUTHORIZED)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </HStack>
                </RadioGroup>
              </HStack>
            </Box>

            <Box>
              <HStack spacing={'0.75rem'}>
                <Box minW={'7rem'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      handleModifyPromotion();
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
                      openModal({
                        type: 'confirm',
                        text: localeText(
                          LANGUAGES.INFO_MSG.DELETE_PROMOTION_MSG,
                        ),
                        onAgree: () => {
                          handleDeletePromotion();
                        },
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
          </HStack>
        </Box>
      }
    >
      <ContentBR h={'1.25rem'} />

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
                  {localeText(LANGUAGES.PROMOTION.PERIOD)}
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
                  {localeText(LANGUAGES.PROMOTION.SELLER)}
                </Text>
              </Box>
              <Box>
                <Text
                  cursor={'pointer'}
                  onClick={() => {
                    handleMember();
                  }}
                  textDecoration={'underline'}
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {promotionInfo.brandName}
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
                  {localeText(LANGUAGES.PROMOTION.PROMOTION_TITLE)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {promotionInfo.name}
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
                  {localeText(LANGUAGES.PROMOTION.DATE_OF_REQUEST)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#556A7E'}
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
            <HStack
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              spacing={'2rem'}
            >
              <Box w={'12.5rem'}>
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PROMOTION.RESTRICT_ACCESS)}
                </Text>
              </Box>
              <Box w={'max-content'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <RadioGroup
                      w={'100%'}
                      value={isAccess ? 1 : 2}
                      onChange={(value) => {
                        const booleanValue = Number(value) === 1 ? true : false;
                        if (booleanValue === true) {
                          setIsBronze(false);
                          setIsGold(false);
                          setIsPlatinum(false);
                        }
                        setIsAccess(booleanValue);
                      }}
                    >
                      <HStack spacing={'1.5rem'} alignItems={'center'}>
                        <Box w={'auto'}>
                          <HStack alignItems={'center'} spacing={'0.5rem'}>
                            <Radio value={1} />
                            <Box w={'11rem'}>
                              <Text
                                textAlign={'left'}
                                color={'#485766'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(
                                  LANGUAGES.PROMOTION.NO_ACCESS_RESTRICTIONS,
                                )}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'max-content'}>
                          <HStack alignItems={'center'} spacing={'0.5rem'}>
                            <Radio value={2} />
                            <Box w={'7.6rem'}>
                              <Text
                                textAlign={'left'}
                                color={'#485766'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(
                                  LANGUAGES.PROMOTION.RESTRICT_ACCESS,
                                )}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </HStack>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <HStack spacing={'0.75rem'}>
                      <Box>
                        <HStack alignItems={'center'} spacing={'0.5rem'}>
                          <CustomCheckBox
                            isSmall
                            isChecked={isPlatinum}
                            onChange={(v) => {
                              setIsPlatinum(v);
                            }}
                          />
                          <Box w={'9.6rem'}>
                            <Text
                              textAlign={'left'}
                              color={'#485766'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.PROMOTION.PLATINUM_MEMBERS)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box>
                        <HStack alignItems={'center'} spacing={'0.5rem'}>
                          <CustomCheckBox
                            isSmall
                            isChecked={isGold}
                            onChange={(v) => {
                              setIsGold(v);
                            }}
                          />
                          <Box w={'7.5rem'}>
                            <Text
                              textAlign={'left'}
                              color={'#485766'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.PROMOTION.GOLD_MEMBERS)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box>
                        <HStack alignItems={'center'} spacing={'0.5rem'}>
                          <CustomCheckBox
                            isSmall
                            isChecked={isBronze}
                            onChange={(v) => {
                              setIsBronze(v);
                            }}
                          />
                          <Box w={'8.5rem'}>
                            <Text
                              textAlign={'left'}
                              color={'#485766'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.PROMOTION.BRONZE_MEMBERS)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'2.5rem'} />

      <Divider borderTop={'1px solid #AEBDCA'} />

      <ContentBR h={'2.5rem'} />

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
          <Box w={'100%'} h={'27.3125rem'}>
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

      <ContentBR h={'2.5rem'} />

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
            {/* Product Rows */}
            <VStack spacing={0}>
              {/* header */}
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
              {/* body */}
              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <VStack spacing={0}>
                      {listProduct.map((item, index) => {
                        return productCard(item, index);
                      })}
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default PromotionsDetailPage;
