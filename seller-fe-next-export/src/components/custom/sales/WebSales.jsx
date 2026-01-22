'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
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
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Button,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import utils from '@/utils';
import { DefaultPaginate } from '@/components';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import SearchInput from '@/components/input/custom/SearchInput';
import useMove from '@/hooks/useMove';
import { LIST_CONTENT_NUM, TIME_ZONE } from '@/constants/common';
import { SUCCESS } from '@/constants/errorCode';
import ordersApi from '@/services/ordersApi';
import useStatus from '@/hooks/useStatus';
import MainContainer from '@/components/layout/MainContainer';
import { toZonedTime } from 'date-fns-tz';
import useModal from '@/hooks/useModal';

const WebSalesPage = () => {
  const { openModal } = useModal();
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

  const [listOrder, setListOrder] = useState([]);

  const {
    isOpen: isOpenDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclosure();

  const handlePatchOrdersStatus = async (ordersId, newStatus) => {
    const param = {
      ordersId: ordersId,
      status: newStatus,
    };

    const result = await ordersApi.patchOrders(param);
    if (result?.errorCode === SUCCESS) {
      setListOrder((prevList) =>
        prevList.map((order) =>
          order.ordersId === ordersId ? { ...order, status: newStatus } : order,
        ),
      );
    } else {
      openModal({ text: result.message });
    }
  };

  const orderCard = useCallback((item, index) => {
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
      <Tr
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <Td>
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
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {orderNum}
          </Text>
        </Td>
        <Td
          onClick={() => {
            moveOrdersDetail(ordersId);
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
            <Box alignContent={'center'}>
              <VStack spacing={'0.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9357rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {firstName}
                  </Text>
                </Box>
                {orderCnt > 1 && (
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9357rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                        ? `외 ${orderCnt} 개`
                        : `and ${orderCnt} others`}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </HStack>
        </Td>
        <Td>
          <Box alignContent={'center'}>
            <VStack spacing={0}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'0.9357rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                  textAlign={'center'}
                >
                  {buyerName}
                </Text>
              </Box>
              {buyerId && (
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9357rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                    textAlign={'center'}
                  >
                    {`(${buyerId})`}
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </Td>
        <Td>
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
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
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
        </Td>
      </Tr>
    );
  });

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
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      startDate: utils.parseDateToYMD(startDate),
      endDate: utils.parseDateToYMD(endDate),
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await ordersApi.getListOrders(param);

    setIsInitList(false);
    if (result?.errorCode === SUCCESS) {
      setListOrder(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListOrder([]);
      setTotalCount(result.totalCount);
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

  return (
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
              <Box>
                <HStack>
                  <Button
                    onClick={() => {
                      window.open('https://asapx.ai', '_blank');
                    }}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'3rem'}
                    w={'8rem'}
                    _disabled={{
                      bg: '#D9E7EC',
                    }}
                    _hover={{}}
                  >
                    <Text
                      color={'#FFF'}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.COMMON.DELIVERY_RECEIVED)}
                    </Text>
                  </Button>
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
            </HStack>
          </Box>

          <Box w="100%">
            <TableContainer w="100%">
              <Table>
                <Thead>
                  <Tr
                    borderTop={'1px solid #73829D'}
                    borderBottom={'1px solid #73829D'}
                  >
                    <Th>
                      <Text
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SALES.ORDER_DATE)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SALES.ORDER_NUMBER)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.SALES.PRODUCT)}
                      </Text>
                    </Th>
                    <Th>
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
                    </Th>
                    <Th>
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
                    </Th>
                    <Th>
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
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listOrder.map((item, index) => {
                    return orderCard(item, index);
                  })}
                  {listOrder.length === 0 && (
                    <Tr>
                      <Td colSpan={6}>
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                          </Text>
                        </Center>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
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
    </MainContainer>
  );
};

export default WebSalesPage;
