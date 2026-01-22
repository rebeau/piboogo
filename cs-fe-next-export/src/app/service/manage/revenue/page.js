'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import ContentHeader from '@/components/layout/header/ContentHeader';
import { LANGUAGES } from '@/constants/lang';
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
  Divider,
  Img,
  Tr,
  Td,
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tfoot,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import utils from '@/utils';
import { DefaultPaginate } from '@/components';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import IconRight from '@public/svgs/icon/right.svg';
import MainContainer from '@/components/layout/MainContainer';
import ordersApi from '@/services/ordersApi';
import { LIST_CONTENT_NUM, TIME_ZONE } from '@/constants/common';
import { SUCCESS } from '@/constants/errorCode';
import useStatus from '@/hooks/useStatus';
import useMove from '@/hooks/useMove';
import { isLocalTest } from '@/utils/deviceUtils';
import RangeDateSplitPicker from '@/components/date/RangeDateSplitPicker';
import { toZonedTime } from 'date-fns-tz';

const RevenuePage = () => {
  const router = useRouter();
  const { moveSellerDetail, moveProductDetail, moveBuyerDetail } = useMove();
  const { lang, localeText } = useLocale();
  const { handleGetOrderStatus, handleGetPaymentStatus } = useStatus();

  const [tabIndex, setTabIndex] = useState(0);

  const now = toZonedTime(new Date(), TIME_ZONE);
  const sevenDaysBefore = new Date(now);
  sevenDaysBefore.setDate(now.getDate() - 7);

  const [startDate, setStartDate] = useState(sevenDaysBefore);
  const [endDate, setEndDate] = useState(now);

  const [initPage, setInitPage] = useState(true);
  const [payStatus, setPayStatus] = useState(0);
  const [searchBy, setSearchBy] = useState(null);
  const [orderBy, setOrderBy] = useState(1);
  const [orderDirection, setOrderDirection] = useState('asc');
  const [ordersStatistics, setOrdersStatistics] = useState({
    totalFeeAmount: 0,
    totalAmount: 0,
    totalOrdersCount: 0,
    totalCouponDiscountAmount: 0,
    totalSettlementAmount: 0,
  });

  const [listOrders, setListOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [listSales, setListSales] = useState([]);
  const [currentPageSales, setCurrentPageSales] = useState(1);
  const [totalCountSales, setTotalCountSales] = useState(1);
  const [contentNumSales, setContentNumSales] = useState(LIST_CONTENT_NUM[0]);

  useEffect(() => {
    if (tabIndex === 0) {
      handleGetListOrders();
    } else if (tabIndex === 1) {
      handleGetListSalesAgent();
    }
  }, [tabIndex, payStatus]);

  useEffect(() => {
    if (
      !initPage &&
      typeof startDate === 'object' &&
      typeof endDate === 'object'
    ) {
      if (tabIndex === 0) {
        handleGetListOrdersAgent();
      } else if (tabIndex === 1) {
        handleGetListSalesAgent();
      }
    }
  }, [startDate, endDate, contentNum, contentNumSales]);

  useEffect(() => {
    if (typeof startDate === 'object' && typeof endDate === 'object') {
      handleGetListOrdersAgent();
    }
  }, [startDate, endDate]);

  const initDate = () => {
    setStartDate(sevenDaysBefore);
    setEndDate(now);
  };

  const handleOnChangeDatePicker = async (dates) => {
    const start = dates[0] || null;
    const end = dates[1] || null;
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    } else if (!start && !end) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const tableHeaderType1 = [
    { width: '5rem', title: localeText(LANGUAGES.REVENUE.BRAND) },
    { width: '5rem', title: localeText(LANGUAGES.REVENUE.ORDER_NUMBER) },
    { width: '17.125rem', title: localeText(LANGUAGES.REVENUE.PRODUCT) },
    { width: '3.25rem', title: localeText(LANGUAGES.REVENUE.PRICE) },
    { width: '2rem', title: localeText(LANGUAGES.REVENUE.QTY) },
    { width: '3.25rem', title: localeText(LANGUAGES.REVENUE.SALES) },
    { width: '3.25rem', title: localeText(LANGUAGES.REVENUE.FEE) },
    { width: '4.5rem', title: localeText(LANGUAGES.REVENUE.COUPON) },
    { width: '3.25rem', title: localeText(LANGUAGES.REVENUE.COIN) },
    { width: '9.125rem', title: localeText(LANGUAGES.REVENUE.SETTLEMENT) },
    { width: '6.25rem', title: localeText(LANGUAGES.REVENUE.ORDER_STATUS) },
    { width: '6.25rem', title: localeText(LANGUAGES.REVENUE.DATE_OF_SALE) },
  ];

  const tableHeaderType2 = [
    { width: '2.75rem', title: localeText(LANGUAGES.REVENUE.ORDER) },
    { width: '3.75rem', title: localeText(LANGUAGES.REVENUE.BRAND) },
    { width: '5rem', title: localeText(LANGUAGES.REVENUE.ORDER_NUMBER) },
    { width: '18.125rem', title: localeText(LANGUAGES.REVENUE.PRODUCT) },
    { width: '5rem', title: localeText(LANGUAGES.REVENUE.ORDER_DATE) },
    { width: '6.25rem', title: localeText(LANGUAGES.REVENUE.ORDERER) },
    {
      width: '6.25rem',
      title: localeText(LANGUAGES.REVENUE.TOTAL_ORDER_AMOUNT),
    },
    { width: '6.25rem', title: localeText(LANGUAGES.REVENUE.PAYMENT_STATUS) },
    { width: '11.375rem', title: localeText(LANGUAGES.REVENUE.ORDER_STATUS) },
  ];

  const handleBrand = (item) => {
    moveSellerDetail(item.sellerUserId);
  };

  const handleProduct = (item) => {
    moveProductDetail(item.productId);
  };

  const handleMember = (item) => {
    if (item?.buyerUserId) {
      moveBuyerDetail(item.buyerUserId);
    } else {
      console.log('not found buyerUserId');
    }
  };

  const handleGetListOrdersAgent = () => {
    if (currentPage === 1) {
      handleGetListOrders();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListOrders = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      startDate: utils.parseDateToStr(startDate, ''),
      endDate: utils.parseDateToStr(endDate, ''),
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }

    const result = await ordersApi.getListOrders(param);
    if (result?.errorCode === SUCCESS) {
      setListOrders(result.datas);
      setTotalCount(result.totalCount);
      if (currentPage === 1) {
        setOrdersStatistics(result.ordersStatistics);
      }
    } else {
      setListOrders([]);
      setTotalCount(1);
      setOrdersStatistics({
        totalFeeAmount: 0,
        totalAmount: 0,
        totalOrdersCount: 0,
        totalCouponDiscountAmount: 0,
        totalSettlementAmount: 0,
      });
    }
    setInitPage(false);
  };

  const ordersCard = useCallback((item, index) => {
    const name = item?.name;
    const count = item?.count || 0;
    const status = item?.status;
    const createdAt = item?.createdAt;
    const brandName = item?.brandName;
    const firstCategoryName = item?.firstCategoryName;
    const secondCategoryName = item?.secondCategoryName;
    const thirdCategoryName = item?.thirdCategoryName;
    const sellerUserId = item?.sellerUserId;
    const discountAmount = item?.discountAmount || 0;
    const productId = item?.productId;
    const ordersId = item?.ordersId;
    const orderNum = item?.orderNum;
    const totalAmount = item?.totalAmount || 0;
    const feeAmount = item?.feeAmount || 0;
    const settlementAmount = item?.settlementAmount || 0;
    const couponDiscountAmount = item?.couponDiscountAmount || 0;
    const rewardDiscountAmount = item?.rewardDiscountAmount || 0;
    const buyerUserId = item?.buyerUserId;
    const unitPrice = item?.unitPrice || 0;
    const buyerUserName = item?.buyerUserName;

    const productImageList = item?.productImageList || [];

    let firstImage = '';
    if (productImageList.length > 0) {
      firstImage = productImageList[0]?.imageS3Url || '';
    }

    return (
      <Tr
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <Td
          px={'0.25rem'}
          cursor={'pointer'}
          onClick={() => {
            handleBrand(item);
          }}
          textDecoration={'underline'}
        >
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {brandName}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseOrderNum(orderNum)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <HStack spacing={'0.75rem'}>
            <Center w={'5rem'} minW="5rem" aspectRatio={1}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                src={firstImage}
              />
            </Center>
            <Box>
              <VStack spacing={'0.5rem'}>
                <Box
                  w={'100%'}
                  cursor={'pointer'}
                  onClick={() => {
                    handleProduct(item);
                  }}
                >
                  <Text
                    textDecoration={'underline'}
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
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(unitPrice)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(count)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(totalAmount)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(feeAmount)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(couponDiscountAmount)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(rewardDiscountAmount)}
          </Text>
        </Td>
        <Td
          px={'0.25rem'}
          cursor={'pointer'}
          onClick={() => {
            handleMember(item);
          }}
        >
          <Text
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            textAlign={'center'}
          >
            {utils.parseDallar(settlementAmount)}
            <br />
            {buyerUserName && (
              <span
                style={{
                  display: 'inline-block',
                  wordBreak: 'break-word',
                }}
              >
                {`(`}
                <span
                  style={{
                    textDecoration: 'none',
                    transition: 'text-decoration 0.3s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = 'underline')
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                >
                  {buyerUserName}
                </span>
                {`)`}
              </span>
            )}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {handleGetOrderStatus(status)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parseDateByCountryCode(createdAt, lang, true)}
          </Text>
        </Td>
      </Tr>
    );
  });

  const handleGetListSalesAgent = () => {
    if (currentPageSales === 1) {
      handleGetListSales();
    } else {
      setCurrentPageSales(1);
    }
  };

  const handleGetListSales = async () => {
    const param = {
      pageNum: currentPageSales,
      contentNum: contentNumSales,
      startDate: utils.parseDateToStr(startDate, ''),
      endDate: utils.parseDateToStr(endDate, ''),
    };
    if (payStatus !== 0) {
      param.payStatus = payStatus;
    }
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await ordersApi.getListOrdersSales(param);
    if (result?.errorCode === SUCCESS) {
      setListSales(result.datas);
      setTotalCountSales(result.totalCount);
    } else {
      setListSales([]);
      setTotalCountSales(1);
    }
    setInitPage(false);
  };

  const handlePatchOrdersStatus = async (ordersId, newStatus) => {
    const param = {
      ordersId: ordersId,
      status: newStatus,
    };
    const result = await ordersApi.patchOrdersStatus(param);
    if (result?.errorCode === SUCCESS) {
      setListSales((prevList) =>
        prevList.map((order) =>
          order.ordersId === ordersId ? { ...order, status: newStatus } : order,
        ),
      );
    }
  };

  const salesCard = useCallback((item, index) => {
    const name = item?.name;
    const status = item?.status;
    const createdAt = item?.createdAt;
    const orderNum = item?.orderNum;
    const brandName = item?.brandName;
    const sellerUserId = item?.sellerUserId;
    const ordersId = item?.ordersId;
    const productId = item?.productId;
    const firstCategoryName = item?.firstCategoryName;
    const secondCategoryName = item?.secondCategoryName;
    const thirdCategoryName = item?.thirdCategoryName;
    const payStatus = item?.payStatus;
    const totalAmount = item?.totalAmount;
    const buyerUserId = item?.buyerUserId;
    const buyerId = item?.buyerId;
    const buyerUserName = item?.buyerUserName;
    const productImageList = item?.productImageList || [];

    let firstImage = '';
    if (productImageList.length > 0) {
      firstImage = productImageList[0]?.imageS3Url || '';
    }

    return (
      <Tr
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.getPageContentNum(
              index,
              currentPageSales,
              totalCountSales,
              contentNumSales,
            )}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            cursor={'pointer'}
            onClick={() => {
              handleBrand(item);
            }}
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {brandName}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {/* {`${utils.parseDateToStr(createdAt, '', true, '', true)}-${ordersId}`} */}
            {utils.parseOrderNum(orderNum)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <HStack spacing={'0.75rem'}>
            <Center w={'5rem'} minW="5rem" aspectRatio={1}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                src={firstImage}
              />
            </Center>
            <Box>
              <VStack spacing={'0.5rem'}>
                <Box
                  w={'100%'}
                  cursor={'pointer'}
                  onClick={() => {
                    handleProduct(item);
                  }}
                >
                  <Text
                    textDecoration={'underline'}
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
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
        <Td
          px={'0.25rem'}
          cursor={'pointer'}
          onClick={() => {
            handleMember(item);
          }}
        >
          <Text
            _hover={{
              textDecoration: 'underline',
            }}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            textAlign={'center'}
          >
            {buyerUserName}
            <br />
            {buyerId && (
              <span
                style={{
                  display: 'inline-block',
                  wordBreak: 'break-word',
                  fontSize: lang === 'KR' ? '0.8rem' : '0.9375rem',
                }}
              >
                {`(${buyerId})`}
              </span>
            )}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(item.totalAmount)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {handleGetPaymentStatus(payStatus)}
          </Text>
        </Td>
        <Td px={'0.25rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {payStatus === 2 ? (
              <Select
                value={Number(status)}
                onChange={(e) => {
                  handlePatchOrdersStatus(ordersId, Number(e.target.value));
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
                  {localeText(LANGUAGES.STATUS.REQUEST_ORDER_CANCELLATION)}
                </option>
                <option value={5}>
                  {localeText(LANGUAGES.STATUS.ORDER_CANCELLATION_COMPLETED)}
                </option>
                <option value={6}>
                  {localeText(LANGUAGES.STATUS.REFUND_REQUEST)}
                </option>
                <option value={7}>
                  {localeText(LANGUAGES.STATUS.RETURN_COMPLETED)}
                </option>
              </Select>
            ) : (
              handleGetOrderStatus(status)
            )}
          </Text>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer>
      <Box w={'100%'}>
        <HStack justifyContent={'flex-start'}>
          <Box
            w={'4.45rem'}
            cursor={'pointer'}
            onClick={() => {
              setTabIndex(0);
            }}
          >
            <Text
              textAlign={'left'}
              fontSize={'1rem'}
              fontWeight={tabIndex === 0 ? 600 : 400}
              color={tabIndex === 0 ? '#66809C' : '#A7C3D2'}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.REVENUE.REVENUE)}
            </Text>
          </Box>

          <Box
            w={'4.45rem'}
            cursor={'pointer'}
            onClick={() => {
              setTabIndex(1);
            }}
          >
            <Text
              textAlign={'left'}
              fontSize={'1rem'}
              fontWeight={tabIndex === 1 ? 600 : 400}
              color={tabIndex === 1 ? '#66809C' : '#A7C3D2'}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.REVENUE.SALES)}
            </Text>
          </Box>
        </HStack>
      </Box>

      <ContentBR h={'1.25rem'} />

      <Box w={'100%'}>
        <HStack justifyContent={'space-between'}>
          <Box>
            <HStack spacing={'0.75rem'}>
              <Box>
                <RangeDateSplitPicker
                  startDate={startDate}
                  endDate={endDate}
                  onInit={initDate}
                  onChange={(date) => {
                    if (!date) return;
                    handleOnChangeDatePicker(date);
                  }}
                />
              </Box>
              {tabIndex === 1 && (
                <Box
                // w={'8rem'}
                >
                  <Select
                    value={payStatus}
                    onChange={(e) => {
                      setPayStatus(Number(e.target.value));
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
                    <option value={0}>{localeText(LANGUAGES.ALL)}</option>
                    <option value={1}>
                      {localeText(LANGUAGES.STATUS.UNPAID)}
                    </option>
                    <option value={2}>
                      {localeText(LANGUAGES.STATUS.PAID)}
                    </option>
                    <option value={3}>
                      {localeText(LANGUAGES.STATUS.REFUND_REQUESTED)}
                    </option>
                    <option value={4}>
                      {localeText(LANGUAGES.STATUS.REFUNDED)}
                    </option>
                  </Select>
                </Box>
              )}
            </HStack>
          </Box>
          <Box w={'24.375rem'} h={'3rem'}>
            <SearchInput
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              onClick={() => {
                if (tabIndex === 0) {
                  handleGetListOrdersAgent();
                } else if (tabIndex === 1) {
                  handleGetListSalesAgent();
                }
              }}
              placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
              placeholderFontColor={'#A7C3D2'}
            />
          </Box>
        </HStack>
      </Box>

      {tabIndex === 0 && (
        <>
          <ContentBR h={'1.25rem'} />

          <Box
            w={'100%'}
            h={'7.25rem'}
            p={'1.25rem'}
            bg={'#90aec412'}
            border={'1px solid #AEBDCA'}
            borderRadius={'0.25rem'}
            boxSizing={'border-box'}
          >
            <HStack spacing={'1.25rem'} h={'100%'}>
              <Box w={'20%'} h={'100%'}>
                <VStack h={'100%'} justifyContent={'space-between'}>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.REVENUE.TOTAL_SALES)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      textAlign={'right'}
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                    >
                      {utils.parseDallar(ordersStatistics.totalAmount)}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Divider
                w={'1px'}
                h={'4.25rem'}
                boxSizing={'border-box'}
                borderRight={'1px solid #AEBDCA'}
              />

              <Box w={'20%'} h={'100%'}>
                <VStack h={'100%'} justifyContent={'space-between'}>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.REVENUE.NUMBER_OF_ORDERS)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      textAlign={'right'}
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                    >
                      {utils.parseAmount(ordersStatistics.totalOrdersCount)}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Divider
                w={'1px'}
                h={'6.5rem'}
                boxSizing={'border-box'}
                borderRight={'1px solid #AEBDCA'}
              />

              <Box w={'20%'} h={'100%'}>
                <VStack h={'100%'} justifyContent={'space-between'}>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.REVENUE.FEES)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      textAlign={'right'}
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#7895B2'}
                    >
                      {utils.parseDallar(ordersStatistics.totalFeeAmount)}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Divider
                w={'1px'}
                h={'6.5rem'}
                boxSizing={'border-box'}
                borderRight={'1px solid #AEBDCA'}
              />

              <Box w={'20%'} h={'100%'}>
                <VStack h={'100%'} justifyContent={'space-between'}>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.REVENUE.COUPON_DISCOUNTS)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      textAlign={'right'}
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#485766'}
                    >
                      {ordersStatistics.totalCouponDiscountAmount}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Divider
                w={'1px'}
                h={'6.5rem'}
                boxSizing={'border-box'}
                borderRight={'1px solid #AEBDCA'}
              />

              <Box w={'20%'} h={'100%'}>
                <VStack h={'100%'} justifyContent={'space-between'}>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.REVENUE.TOTAL_SETTLEMENT)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      textAlign={'right'}
                      fontSize={'1.25rem'}
                      fontWeight={500}
                      lineHeight={'2.25rem'}
                      color={'#B20000'}
                    >
                      {utils.parseDallar(
                        ordersStatistics.totalSettlementAmount,
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>
        </>
      )}

      <ContentBR h={'1.25rem'} />

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <TableContainer w={'100%'}>
                  <Table w={'100%'}>
                    <Thead
                      w={'100%'}
                      borderTop={'1px solid #73829D'}
                      borderBottom={'1px solid #73829D'}
                      px={'1rem'}
                      py={'0.75rem'}
                    >
                      <Tr>
                        {tabIndex === 0 &&
                          tableHeaderType1.map((item, index) => {
                            return (
                              <Th key={index} px={'0.25rem'}>
                                <Text
                                  w={'100%'}
                                  textAlign={'center'}
                                  color={'#2A333C'}
                                  fontSize={
                                    lang === 'KR' ? '0.81rem' : '0.9375rem'
                                  }
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  {item.title}
                                </Text>
                              </Th>
                            );
                          })}
                        {tabIndex === 1 &&
                          tableHeaderType2.map((item, index) => {
                            return (
                              <Th key={index} px={'0.25rem'}>
                                <Text
                                  textAlign={'center'}
                                  color={'#2A333C'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  {item.title}
                                </Text>
                              </Th>
                            );
                          })}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tabIndex === 0 && (
                        <>
                          {listOrders.map((item, index) => {
                            return ordersCard(item, index);
                          })}
                          {listOrders.length === 0 && (
                            <Tr>
                              <Td colSpan={12} h="80px">
                                <Text
                                  w={'full'}
                                  fontSize={'1.5rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                  textAlign={'center'}
                                >
                                  {localeText(
                                    LANGUAGES.INFO_MSG.NO_ORDER_DETAILS,
                                  )}
                                </Text>
                              </Td>
                            </Tr>
                          )}
                        </>
                      )}
                      {tabIndex === 1 && (
                        <>
                          {listSales.map((item, index) => {
                            return salesCard(item, index);
                          })}
                          {listSales.length === 0 && (
                            <Tr>
                              <Td colSpan={9} h="80px">
                                <Text
                                  w={'full'}
                                  fontSize={'1.5rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                  textAlign={'center'}
                                >
                                  {localeText(
                                    LANGUAGES.INFO_MSG.NO_SALES_DETAILS,
                                  )}
                                </Text>
                              </Td>
                            </Tr>
                          )}
                        </>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>

                <ContentBR h={'1.25rem'} />

                <Box>
                  <HStack justifyContent={'space-between'}>
                    {tabIndex === 0 && (
                      <>
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
                            boxSizing={'border-box'}
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
                      </>
                    )}
                    {tabIndex === 1 && (
                      <>
                        <Box w={'6.125rem'}>
                          <Select
                            value={contentNumSales}
                            onChange={(e) => {
                              setContentNumSales(e.target.value);
                            }}
                            py={'0.75rem'}
                            pl={'1rem'}
                            p={0}
                            w={'100%'}
                            h={'3rem'}
                            bg={'#FFF'}
                            boxSizing={'border-box'}
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
                            currentPage={currentPageSales}
                            setCurrentPage={setCurrentPageSales}
                            totalCount={totalCountSales}
                            contentNum={contentNumSales}
                          />
                        </Box>
                      </>
                    )}
                  </HStack>
                </Box>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default RevenuePage;
