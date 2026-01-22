'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import ContentHeader from '@/components/custom/header/ContentHeader';
import { COUNTRY, LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import utils from '@/utils';
import { DefaultPaginate } from '@/components';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import SearchInput from '@/components/input/custom/SearchInput';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';
import { LIST_CONTENT_NUM, TIME_ZONE } from '@/constants/common';
import { SUCCESS } from '@/constants/errorCode';
import ordersApi from '@/services/ordersApi';
import useStatus from '@/hooks/useStatus';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import { toZonedTime } from 'date-fns-tz';
import useModal from '@/hooks/useModal';

const MobileSalesPage = () => {
  const { openModal } = useModal();
  const { isMobile, clampW } = useDevice();
  const { moveOrdersDetail } = useMove();
  const { lang, localeText } = useLocale();
  const { handleGetDeliveryStatus, handleGetPaymentStatus } = useStatus();

  const [isInitList, setIsInitList] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [dateStr, setDateStr] = useState('');

  const now = toZonedTime(new Date(), TIME_ZONE);
  const sevenDaysBefore = new Date(now);
  sevenDaysBefore.setDate(now.getDate() - 7);
  const [startDate, setStartDate] = useState(sevenDaysBefore);
  const [endDate, setEndDate] = useState(now);

  const [searchBy, setSearchBy] = useState(null);

  const {
    isOpen: isOpenDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclosure();

  // 스크롤 처리
  /*
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);
  // 로딩이 완료되면 페이지 번호를 증가시킴
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // 스크롤이 끝에 다다르면
      if (scrollHeight - scrollTop === clientHeight && !loading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };
  // 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const scrollableElement = scrollRef.current;
    if (isMobile(true)) {
      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', handleScroll);
      }
    }
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);
  */

  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPage !== 1) {
          if (listOrder.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            handleGetListOrder();
          }
        } else {
          // 1 페이지
          handleGetListOrder();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const key = 'ordersId';
  const [listOrder, setListOrder] = useState([]);

  const orderCard = useCallback((item, index) => {
    const handlePatchOrdersStatus = async (ordersId, newStatus) => {
      const param = {
        ordersId: ordersId,
        status: newStatus,
      };

      const result = await ordersApi.patchOrders(param);
      if (result?.errorCode === SUCCESS) {
        setListOrder((prevList) =>
          prevList.map((order) =>
            order.ordersId === ordersId
              ? { ...order, status: newStatus }
              : order,
          ),
        );
      } else {
        openModal({ text: result.message });
      }
    };

    const buyerName = item?.buyerName;
    const buyerId = item?.buyerId;
    const createdAt = item?.createdAt;
    const ordersId = item?.ordersId;
    const orderNum = item?.orderNum;
    const payStatus = item?.payStatus;
    const status = item?.status;
    const ordersProductList = item?.ordersProductList || [];

    let firstOrder = null;
    let orderCnt = 0;
    let firstName = null;
    let firstDeliveryStatus = null;
    let productImageList = [];
    let firstImageSrc = null;
    if (ordersProductList.length > 0) {
      firstOrder = ordersProductList[0];
      orderCnt = ordersProductList.length;
      firstName = firstOrder.name;
      firstDeliveryStatus = firstOrder.deliveryStatus;
      productImageList = firstOrder.productImageList;
      if (productImageList.length > 0) {
        firstImageSrc = productImageList[0].imageS3Url;
      }
    }

    return (
      <Box
        key={index}
        w={'100%'}
        p="1rem"
        borderTop="1px solid #AEBDCA"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        gap="1.25rem"
      >
        <HStack spacing={'1.25rem'}>
          <Box
            onClick={() => {
              moveOrdersDetail(ordersId);
            }}
          >
            <VStack spacing={'0.75rem'} alignItems={'flex-start'}>
              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Box w={clampW(5, 8)} maxW={clampW(5, 8)}>
                    <Center
                      w={clampW(3.75, 5)}
                      maxW={clampW(3.75, 5)}
                      h={clampW(3.75, 5)}
                    >
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={firstImageSrc}
                      />
                    </Center>
                  </Box>
                  <Text
                    textAlign={'left'}
                    color={'#485766'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {firstName}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color={'#2A333C'}
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.SALES.ORDER_DATE)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color={'#485766'}
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {utils.parseDateByCountryCode(createdAt, lang)}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color={'#2A333C'}
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.SALES.ORDER_NUMBER)}
                  </Text>

                  <Text
                    textAlign={'left'}
                    color={'#485766'}
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                    lineHeight="1.5rem"
                    whiteSpace={'pre-wrap'}
                  >
                    {orderNum}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color={'#2A333C'}
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.SALES.ORDERERS)}
                  </Text>
                  <VStack spacing={0} alignItems={'flex-start'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(0.75, 0.9375)}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {buyerName}
                      </Text>
                    </Box>
                    {buyerId && (
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.75, 0.9375)}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {`(${buyerId})`}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </HStack>
              </Box>
              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.SALES.PAYMENT_STATUS)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color={payStatus < 3 ? '#485766' : '#B20000'}
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                  >
                    {handleGetPaymentStatus(payStatus)}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.SALES.ORDER_STATUS)}
                  </Text>

                  <Text
                    textAlign={'left'}
                    color={'#485766'}
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                    lineHeight="1.5rem"
                  >
                    {payStatus === 2 ? (
                      <Select
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        value={Number(status)}
                        onChange={(e) => {
                          handlePatchOrdersStatus(
                            ordersId,
                            Number(e.target.value),
                          );
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
                        <option value={1}>
                          {localeText(LANGUAGES.STATUS.SHIPPING_PREPARATION)}
                        </option>
                        <option value={2}>
                          {localeText(LANGUAGES.STATUS.SHIPPING)}
                        </option>
                        <option value={8}>
                          {localeText(LANGUAGES.STATUS.SHIPPED)}
                        </option>
                        <option value={3}>
                          {localeText(LANGUAGES.STATUS.ORDER_COMPLETED)}
                        </option>
                        <option value={4}>
                          {localeText(
                            LANGUAGES.STATUS.REQUEST_ORDER_CANCELLATION,
                          )}
                        </option>
                        <option value={5}>
                          {localeText(
                            LANGUAGES.STATUS.ORDER_CANCELLATION_COMPLETED,
                          )}
                        </option>
                        <option value={6}>
                          {localeText(LANGUAGES.STATUS.RETURN_REQUEST)}
                        </option>
                        <option value={7}>
                          {localeText(LANGUAGES.STATUS.RETURN_COMPLETED)}
                        </option>
                      </Select>
                    ) : (
                      handleGetDeliveryStatus(status)
                    )}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
    );
  });

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingIds = existingDatas.map((item) => item[key]);
    const newDatas = resultDatas.filter(
      (item) => !existingIds.includes(item[key]),
    );
    return newDatas;
  };

  useEffect(() => {
    if (typeof startDate === 'object' && typeof endDate === 'object') {
      handleGetListOrderAgent();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (
      !isInitList &&
      typeof startDate === 'object' &&
      typeof endDate === 'object'
    ) {
      handleGetListOrder();
    }
  }, [currentPage, contentNum]);

  const handleGetListOrderAgent = () => {
    if (currentPage === 1) {
      handleGetListOrder();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListOrder = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      startDate: utils.parseDateToYMD(startDate),
      endDate: utils.parseDateToYMD(endDate),
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    try {
      const result = await ordersApi.getListOrders(param);

      setIsInitList(false);
      if (result?.errorCode === SUCCESS) {
        setListOrder((prev) => {
          const newDatas = getNewDatas(
            result.datas,
            listOrder,
            currentPage,
            contentNum,
          );
          return [...prev, ...newDatas];
        });
        setTotalCount(result.totalCount);
      } else {
        if (isMobile(true)) {
          setListOrder((prev) => [...prev, ...[]]);
        } else {
          setListOrder([]);
        }
        setTotalCount(result.totalCount);
      }
    } finally {
      setLoading(false);
    }
  });

  const initDate = () => {
    setStartDate(sevenDaysBefore);
    setEndDate(now);
    onCloseDatePicker();
  };

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

  const handleOnChangeDatePicker = async (dates) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    if (dates.startDate && dates.endDate) {
      onCloseDatePicker();
    }
  };

  return isMobile(true) ? (
    <MainContainer>
      <Box w={'100%'} px={clampW(1, 5)}>
        <Box w={'100%'}>
          <VStack justifyContent={'space-between'}>
            <Box w={'100%'}>
              <RangeDatePicker
                dateStr={dateStr}
                isOpen={isOpenDatePicker}
                onOpen={onOpenDatePicker}
                onClose={onCloseDatePicker}
                onInitDate={initDate}
                start={startDate}
                end={endDate}
                handleOnChangeDate={handleOnChangeDatePicker}
              />
            </Box>
            <Box w={'100%'} h={'3rem'}>
              <SearchInput
                value={searchBy}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                }}
                onClick={() => {
                  handleGetListOrderAgent();
                }}
                placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                placeholderFontColor={'#A7C3D2'}
              />
            </Box>
          </VStack>
        </Box>

        <ContentBR h={'1.25rem'} />

        <Box
          w={'100%'}
          // h={'calc(100vh - 17.3125rem)'} overflowY={'auto'}
        >
          <VStack
            w={'100%'}
            h={'100%'}
            spacing={0}
            // ref={scrollRef}
          >
            {listOrder.map((item, index) => {
              return orderCard(item, index);
            })}
            {listOrder.length === 0 && (
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
    <MainContainer>
      <Box w={'100%'}>
        <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Box w={'16rem'}>
                <RangeDatePicker
                  dateStr={dateStr}
                  isOpen={isOpenDatePicker}
                  onOpen={onOpenDatePicker}
                  onClose={onCloseDatePicker}
                  onInitDate={initDate}
                  start={startDate}
                  end={endDate}
                  handleOnChangeDate={handleOnChangeDatePicker}
                />
              </Box>
              <Box w={'24.375rem'} h={'3rem'}>
                <SearchInput
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  onClick={() => {
                    handleGetListOrderAgent();
                  }}
                  placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                  placeholderFontColor={'#A7C3D2'}
                />
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
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
                      <Box w={'8.75rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SALES.ORDER_DATE)}
                        </Text>
                      </Box>
                      <Box w={'10rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SALES.ORDER_NUMBER)}
                        </Text>
                      </Box>
                      <Box w={'19.625rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SALES.PRODUCT)}
                        </Text>
                      </Box>
                      <Box w={'11.25rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                          whiteSpace={'pre-wrap'}
                        >
                          {localeText(LANGUAGES.SALES.ORDERERS)}
                        </Text>
                      </Box>
                      <Box w={'8.75rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                          whiteSpace={'pre-wrap'}
                        >
                          {localeText(LANGUAGES.SALES.PAYMENT_STATUS)}
                        </Text>
                      </Box>
                      <Box w={'6.375rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                          whiteSpace={'pre-wrap'}
                        >
                          {localeText(LANGUAGES.SALES.ORDER_STATUS)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  {/* body */}
                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <VStack spacing={0}>
                          {listOrder.map((item, index) => {
                            return orderCard(item, index);
                          })}
                        </VStack>
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
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </MainContainer>
  );
};

export default MobileSalesPage;
