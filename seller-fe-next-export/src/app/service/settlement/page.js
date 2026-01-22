'use client';

import ContentHeader from '@/components/custom/header/ContentHeader';
import { SERVICE } from '@/constants/pageURL';
import {
  Box,
  Center,
  Divider,
  HStack,
  Img,
  Text,
  Image as ChakraImage,
  VStack,
  Select,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import IconRight from '@public/svgs/icon/right.svg';
import useLocale from '@/hooks/useLocale';
import { COUNTRY, LANGUAGES } from '@/constants/lang';
import utils from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import SearchInput from '@/components/input/custom/SearchInput';
import MonthDatePicker from '@/components/date/MonthDatePicker';
import { LIST_CONTENT_NUM } from '@/constants/common';
import settlementApi from '@/services/settlementApi';
import { SUCCESS } from '@/constants/errorCode';
import useMove from '@/hooks/useMove';
import { useRecoilValue } from 'recoil';
import { normalUserState } from '@/stores/userRecoil';
import useStatus from '@/hooks/useStatus';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import useDevice from '@/hooks/useDevice';

const SettlementPage = () => {
  const { isMobile, clampW } = useDevice();
  const userInfo = useRecoilValue(normalUserState);
  const { moveProductDetail } = useMove();
  const { handleGetSellerPaymentStatus } = useStatus();

  const router = useRouter();
  const { lang, localeText } = useLocale();

  const [initPage, setInitPage] = useState(true);
  const [dateStr, setDateStr] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );

  const [settlementStatistics, setSettlementStatistics] = useState({
    totalSettlementAmount: 0,
    readyTotalSettlementAmount: 0,
    successTotalSettlementAmount: 0,
    totalSettlementCount: 0,
    readySettlementCount: 0,
    successSettlementCount: 0,
    cancelSettlementCount: 0,
  });

  const [status, setStatus] = useState(0);
  const [searchBy, setSearchBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [listOrders, setListOrder] = useState([]);

  useEffect(() => {
    if (typeof startDate === 'object' && typeof endDate === 'object') {
      handleGetListSettlmentAgent();
    }
  }, [startDate, endDate, status]);

  useEffect(() => {
    if (
      !initPage &&
      typeof startDate === 'object' &&
      typeof endDate === 'object'
    ) {
      handleGetListSettlment();
    }
  }, [currentPage, contentNum]);

  useEffect(() => {
    if (startDate && endDate) {
      setDateStr(
        `${utils.parseDateToStr(startDate, '.')} - ${utils.parseDateToStr(
          endDate,
          '.',
        )}`,
      );
    }
  }, [startDate, endDate]);

  const handleGetListSettlmentAgent = () => {
    if (currentPage === 1) {
      handleGetListSettlment();
    } else {
      setCurrentPage(1);
    }
  };

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item.productId);
    // 기존 데이터에서 이미 존재하는 데이터를 제외
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item.productId),
    );
    return newDatas;
  };

  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight - 10 && !loading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const handleGetListSettlment = async () => {
    if (loading) return;
    setLoading(true);
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      startDate: utils.parseDateToYMD(startDate),
      endDate: utils.parseDateToYMD(endDate),
    };
    if (status !== 0) {
      param.sellerPayStatus = status;
    }
    if (searchBy) {
      param.searchBy = searchBy;
    }
    let result = await settlementApi.getListSettlement(param);
    try {
      setInitPage(false);
      if (result?.errorCode === SUCCESS) {
        if (currentPage === 1) {
          setSettlementStatistics(result.settlementStatistics);
        }
        setListOrder((prev) => {
          const newDatas = getNewDatas(
            result.datas,
            listOrders,
            currentPage,
            contentNum,
          );
          return [...prev, ...newDatas];
        });
        setTotalCount(result.totalCount);
      } else {
        if (currentPage === 1) {
          setSettlementStatistics({
            totalSettlementAmount: 0,
            readyTotalSettlementAmount: 0,
            successTotalSettlementAmount: 0,
            totalSettlementCount: 0,
            readySettlementCount: 0,
            successSettlementCount: 0,
            cancelSettlementCount: 0,
          });
        }
        if (isMobile()) {
          setListOrder((prev) => [...prev, ...[]]);
        } else {
          setListOrder([]);
        }
        setTotalCount(result.totalCount);
      }
    } finally {
      setLoading(false);
    }
  };

  const ordersCard = useCallback((item, index) => {
    const couponDiscountAmount = item?.couponDiscountAmount || 0;
    const rewardDiscountAmount = item?.rewardDiscountAmount || 0;
    const buyerName = item?.buyerName || '';
    const createdAt = item?.createdAt || null;
    const ordersId = item?.ordersId || null;
    const sellerPayStatus = item?.sellerPayStatus;
    const totalAmount = item?.totalAmount || 0;
    const discountAmount = item?.discountAmount || 0;
    const actualAmount = item?.actualAmount || 0;
    const feeAmount = item?.feeAmount || 0;
    const settlementAmount = item?.settlementAmount || 0;
    const bundleDiscountAmount = item?.bundleDiscountAmount || 0;
    const ordersProductList = item?.ordersProductList || [];

    let orderProductCnt = 0;
    let firstProduct = null;
    if (ordersProductList.length > 0) {
      firstProduct = ordersProductList[0];
      orderProductCnt = ordersProductList.length;
    }
    const firstProductImageList = firstProduct?.productImageList;
    let firstImageSrc = null;
    if (firstProductImageList.length > 0) {
      firstImageSrc = firstProductImageList[0].imageS3Url;
    }

    let name = firstProduct?.name;
    let count = firstProduct?.count;
    let productId = firstProduct?.productId;
    let unitPrice = firstProduct?.unitPrice;
    let ordersProductId = firstProduct?.ordersProductId;

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
              <Box w={clampW(8, 10)}>
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
                  {orderProductCnt > 1 && (
                    <Box w={'100%'}>
                      <Text
                        color={'#66809C'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                        opacity={'0.7'}
                      >
                        {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                          ? `외 ${orderProductCnt} 개`
                          : `and ${orderProductCnt} others`}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.TOTAL_PRODUCT_AMOUNT)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(totalAmount)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.QUANTITY)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseAmount(count)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.SALES_AMOUNT)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(actualAmount)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.COMMISSION_FEE)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(feeAmount)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.COUPON_DISCOUNT)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(couponDiscountAmount)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.REWARD_AMOUNT)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(rewardDiscountAmount)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.BUNDLE_DISCOUNT)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(bundleDiscountAmount)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.SETTLEMENT_MONEY)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDallar(settlementAmount)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.BUYER)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {buyerName}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.SETTLEMENT_STATUS)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {status}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(8, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.SALES_DATE)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDateByCountryCode(createdAt, lang)}
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
        h={'6.5rem'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={
          listOrders.length - 1 === index ? null : '1px solid #73829D'
        }
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Box
            w={'18.9375rem'}
            onClick={() => {
              moveProductDetail(productId);
            }}
            cursor={'pointer'}
          >
            <HStack spacing={'0.75rem'}>
              <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
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
                      {firstProduct.name}
                    </Text>
                  </Box>
                  {orderProductCnt > 1 && (
                    <Box w={'100%'}>
                      <Text
                        color={'#66809C'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                        opacity={'0.7'}
                      >
                        {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                          ? `외 ${orderProductCnt} 개`
                          : `and ${orderProductCnt} others`}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            </HStack>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(totalAmount)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseAmount(firstProduct.count)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(totalAmount)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(feeAmount)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(couponDiscountAmount)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(rewardDiscountAmount)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(bundleDiscountAmount)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(settlementAmount)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {buyerName}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {handleGetSellerPaymentStatus(sellerPayStatus)}
            </Text>
          </Box>
          <Box w={'7.8125rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDateByCountryCode(createdAt, lang)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <MainContainer
      contentHeader={
        <Box w={'11.625rem'} h={'3rem'}>
          <MonthDatePicker
            handleOnChangeDate={(retDate) => {
              const year = retDate.getFullYear();
              const month = retDate.getMonth();
              setStartDate(new Date(year, month, 1));
              setEndDate(new Date(year, month + 1, 0));
            }}
          />
        </Box>
      }
    >
      <Box w={'100%'} px={clampW(1, 5)}>
        <VStack spacing={'2.5rem'} alignItems={'flex-start'}>
          <Box
            w={'100%'}
            p={'1.25rem'}
            bg={'#90aec412'}
            border={'1px solid #AEBDCA'}
            borderRadius={'0.25rem'}
            boxSizing={'border-box'}
          >
            <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
              <Box>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.PERIOD)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={clampW(1, 1.25)}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'right'}
                    >
                      {dateStr}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Box>
                <VStack spacing={'1rem'} alignItems={'flex-start'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.TOTAL_SETTLEMENT)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'left'}
                    >
                      {utils.parseDallar(
                        settlementStatistics.totalSettlementAmount,
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Box w={'auto'}>
                <VStack spacing={'1rem'} alignItems={'flex-start'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'left'}
                    >
                      {utils.parseDallar(
                        settlementStatistics.readyTotalSettlementAmount,
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Box w={'auto'}>
                <VStack spacing={'1rem'} alignItems={'flex-start'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.SETTLED)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'right'}
                    >
                      {utils.parseDallar(
                        settlementStatistics.successTotalSettlementAmount,
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Box w={'100%'}>
            <VStack w={'100%'} spacing={'1.25rem'}>
              <Box w={'100%'}>
                <Wrap spacingX={'2.5rem'}>
                  <WrapItem>
                    <Box
                      py={'0.5rem'}
                      cursor={'pointer'}
                      onClick={() => {
                        setStatus(0);
                      }}
                    >
                      <Text
                        textAlign={'center'}
                        color={status === 0 ? '#66809C' : '#A7C3D2'}
                        fontSize={'0.9375rem'}
                        fontWeight={status === 0 ? 600 : 400}
                        lineHeight={'1.5rem'}
                      >
                        {`${localeText(LANGUAGES.PRODUCTS.ALL)} (${utils.parseAmount(settlementStatistics.totalSettlementCount)})`}
                      </Text>
                    </Box>
                  </WrapItem>
                  <WrapItem>
                    <Box
                      py={'0.5rem'}
                      cursor={'pointer'}
                      onClick={() => {
                        setStatus(1);
                      }}
                    >
                      <Text
                        textAlign={'center'}
                        color={status === 1 ? '#66809C' : '#A7C3D2'}
                        fontSize={'0.9375rem'}
                        fontWeight={status === 1 ? 600 : 400}
                        lineHeight={'1.5rem'}
                      >
                        {`${localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT)} (${utils.parseAmount(settlementStatistics.readySettlementCount)})`}
                      </Text>
                    </Box>
                  </WrapItem>
                  <WrapItem>
                    <Box
                      py={'0.5rem'}
                      cursor={'pointer'}
                      onClick={() => {
                        setStatus(2);
                      }}
                    >
                      <Text
                        textAlign={'center'}
                        color={status === 2 ? '#66809C' : '#A7C3D2'}
                        fontSize={'0.9375rem'}
                        fontWeight={status === 2 ? 600 : 400}
                        lineHeight={'1.5rem'}
                      >
                        {`${localeText(LANGUAGES.SETTLEMENT.SETTLED)} (${utils.parseAmount(settlementStatistics.successTotalSettlementAmount)})`}
                      </Text>
                    </Box>
                  </WrapItem>
                  <WrapItem>
                    <Box
                      py={'0.5rem'}
                      cursor={'pointer'}
                      onClick={() => {
                        setStatus(3);
                      }}
                    >
                      <Text
                        textAlign={'center'}
                        color={status === 3 ? '#66809C' : '#A7C3D2'}
                        fontSize={'0.9375rem'}
                        fontWeight={status === 3 ? 600 : 400}
                        lineHeight={'1.5rem'}
                      >
                        {`${localeText(LANGUAGES.SETTLEMENT.CANCEL_SETTLEMENT)} (${utils.parseAmount(settlementStatistics.cancelSettlementCount)})`}
                      </Text>
                    </Box>
                  </WrapItem>
                </Wrap>
              </Box>
              <Box w={'100%'} h={'3rem'}>
                <SearchInput
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  onClick={() => {
                    handleGetListSettlmentAgent();
                  }}
                  placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                  placeholderFontColor={'#A7C3D2'}
                />
              </Box>
            </VStack>
          </Box>
        </VStack>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <VStack spacing={0}>
            {listOrders.map((item, index) => {
              return ordersCard(item, index);
            })}
            {listOrders.length === 0 && (
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
      </Box>
    </MainContainer>
  ) : (
    <MainContainer
      contentHeader={
        <Box w={'11.625rem'} h={'3rem'}>
          <MonthDatePicker
            handleOnChangeDate={(retDate) => {
              const year = retDate.getFullYear();
              const month = retDate.getMonth();
              setStartDate(new Date(year, month, 1));
              setEndDate(new Date(year, month + 1, 0));
            }}
          />
        </Box>
      }
    >
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'} alignItems={'flex-start'}>
          <Box
            w={'100%'}
            h={'7.25rem'}
            p={'1.25rem'}
            bg={'#90aec412'}
            border={'1px solid #AEBDCA'}
            borderRadius={'0.25rem'}
            boxSizing={'border-box'}
          >
            <HStack spacing={'1.25rem'}>
              <Box w={'15.6875rem'} maxW={'25%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.PERIOD)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={clampW(0.7, 1.25)}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'right'}
                    >
                      {dateStr}
                    </Text>
                  </Box>
                </VStack>
              </Box>
              <Divider
                w={'1px'}
                h={'5rem'}
                boxSizing={'border-box'}
                borderRight={'1px solid #AEBDCA'}
              />
              <Box w={'15.6875rem'} maxW={'25%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.TOTAL_SETTLEMENT)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'right'}
                    >
                      {utils.parseDallar(
                        settlementStatistics.totalSettlementAmount,
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>
              <Divider
                w={'1px'}
                h={'5rem'}
                boxSizing={'border-box'}
                borderRight={'1px solid #AEBDCA'}
              />
              <Box w={'15.6875rem'} maxW={'25%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'right'}
                    >
                      {utils.parseDallar(
                        settlementStatistics.readyTotalSettlementAmount,
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>
              <Divider
                w={'1px'}
                h={'5rem'}
                boxSizing={'border-box'}
                borderRight={'1px solid #AEBDCA'}
              />
              <Box w={'15.6875rem'} maxW={'25%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SETTLEMENT.SETTLED)}
                      </Text>
                    </Box>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                      textAlign={'right'}
                    >
                      {utils.parseDallar(
                        settlementStatistics.successTotalSettlementAmount,
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>
          <Box w={'100%'}>
            <VStack w={'100%'} spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                  <Box>
                    <HStack spacing={'2.5rem'}>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(0);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 0 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 0 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.PRODUCTS.ALL)} (${utils.parseAmount(settlementStatistics.totalSettlementCount)})`}
                        </Text>
                      </Box>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(1);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 1 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 1 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT)} (${utils.parseAmount(settlementStatistics.readySettlementCount)})`}
                        </Text>
                      </Box>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(2);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 2 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 2 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.SETTLEMENT.SETTLED)} (${utils.parseAmount(settlementStatistics.successTotalSettlementAmount)})`}
                        </Text>
                      </Box>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(3);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 3 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 3 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.SETTLEMENT.CANCEL_SETTLEMENT)} (${utils.parseAmount(settlementStatistics.cancelSettlementCount)})`}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box minW={'24.375rem'} h={'3rem'}>
                    <SearchInput
                      value={searchBy}
                      onChange={(e) => {
                        setSearchBy(e.target.value);
                      }}
                      onClick={() => {
                        handleGetListSettlmentAgent();
                      }}
                      placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                      placeholderFontColor={'#A7C3D2'}
                    />
                  </Box>
                </HStack>
              </Box>
              <Box
                w={'100%'}
                borderBottom={'1px solid #73829D'}
                overflowX={'auto'}
              >
                <Box w={'100rem'}>
                  <VStack spacing={0} w={'100%'}>
                    <Box
                      w={'100%'}
                      borderTop={'1px solid #73829D'}
                      borderBottom={'1px solid #73829D'}
                      px={'1rem'}
                      py={'0.75rem'}
                      boxSizing={'border-box'}
                    >
                      <HStack spacing={'0.75rem'}>
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
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(
                              LANGUAGES.SETTLEMENT.TOTAL_PRODUCT_AMOUNT,
                            )}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.QUANTITY)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(
                              LANGUAGES.SETTLEMENT.TOTAL_DISCOUNT_AMOUNT,
                            )}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.COMMISSION_FEE)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.COUPON_DISCOUNT)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.REWARD_AMOUNT)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.BUNDLE_DISCOUNT)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.SETTLEMENT_MONEY)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.BUYER)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.SETTLEMENT_STATUS)}
                          </Text>
                        </Box>
                        <Box w={'7.8125rem'}>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SETTLEMENT.SALES_DATE)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <VStack spacing={'0.75rem'}>
                        <Box w={'100%'}>
                          <VStack spacing={0}>
                            {listOrders.map((item, index) => {
                              return ordersCard(item, index);
                            })}
                            {listOrders.length === 0 && (
                              <Center w={'100%'} h={'10rem'}>
                                <Text
                                  fontSize={'1.5rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(
                                    LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED,
                                  )}
                                </Text>
                              </Center>
                            )}
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box w={'6.125rem'}>
                    <Select
                      value={contentNum}
                      onChange={(e) => {
                        setContentNum(e.target.value);
                      }}
                      py={'0.75rem'}
                      pl={'1rem'}
                      p={0}
                      w={'100%'}
                      h={'3rem'}
                      bg={'#FFF'}
                      borderRadius={'0.25rem'}
                      border={'1px solid #9CADBE'}
                    >
                      {LIST_CONTENT_NUM.map((value, index) => {
                        return (
                          <option value={value} key={index}>
                            {value}
                          </option>
                        );
                      })}
                    </Select>
                  </Box>

                  <Box>
                    <DefaultPaginate
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalCount={totalCount}
                      contentNum={contentNum}
                    />
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>

        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  );
};

export default SettlementPage;
