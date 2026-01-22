'use client';

import {
  Box,
  Button,
  Center,
  HStack,
  Text,
  VStack,
  Img,
  Divider,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import ContentBR from '@/components/custom/ContentBR';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';
import MyPageOrderLayout from './MyPageOrderLayout';
import utils from '@/utils';
import useOrders from '@/hooks/useOrders';
import ordersApi from '@/services/ordersApi';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import { useRecoilState } from 'recoil';
import { initOrdersState } from '@/stores/orderRecoil';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';
import useStatus from '@/hooks/useStatus';

const OrderHistoryPage = () => {
  const { isMobile, clampW } = useDevice();
  const { handleGetPaymentStatus } = useStatus();
  const { moveProductDetail } = useMove();
  const [isInitOrders, setIsInitOrders] = useRecoilState(initOrdersState);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [contentNum, setContentNum] = useState(5);
  const [totalCount, setTotalCount] = useState(1);

  const { lang, localeText } = useLocale();

  const [listOrder, setListOrder] = useState([]);

  const { handleDeliveryStatus, handleDeliveryBntByStatus, handleDetail } =
    useOrders();

  useEffect(() => {
    handleGetListOrders();
  }, [currentPage]);

  useEffect(() => {
    if (isInitOrders) {
      setIsInitOrders(false);
      handleGetListOrdersAgent();
    }
  }, [isInitOrders]);

  const handleGetListOrdersAgent = () => {
    if (currentPage === 1) {
      handleGetListOrders();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListOrders = useCallback(async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    const result = await ordersApi.getListOrders(param);

    if (result?.errorCode === SUCCESS) {
      setListOrder(result.datas);
      setTotalCount(result.totalCount);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListOrder([]);
      setTotalCount(0);
    }
  });

  const orderCardRow = useCallback((orders, rowIndex) => {
    const actualAmount = orders.actualAmount;
    const createdAt = orders.createdAt;
    const discountAmount = orders.discountAmount;
    const orderNum = orders.orderNum;
    const ordersId = orders.ordersId;
    const payStatus = orders.payStatus;
    const status = orders.status;
    const totalAmount = orders.totalAmount;
    const ordersProducts = orders?.ordersProducts || [];

    let brandName = null;
    /*
    let count = null;
    let deliveryStatus = null;
    let name = null;
    let ordersProductOptionList = [];
    let productImageList = [];
    */

    let firstOrders = null;
    if (ordersProducts.length > 0) {
      firstOrders = ordersProducts[0];
    }
    if (firstOrders?.brandName) {
      brandName = firstOrders.brandName;
    }

    return isMobile(true) ? (
      <Box w={'100%'} key={rowIndex}>
        <VStack spacing={'1.25rem'}>
          <Box
            w={'100%'}
            py={'1.25rem'}
            borderTop={'1px solid #576076'}
            borderBottom={'1px solid #AEBDCA'}
            boxSizing={'border-box'}
          >
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box
                    px={'1rem'}
                    py={'0.5rem'}
                    // w={'6.4rem'}
                    h={'2.5rem'}
                    bg={payStatus === 2 ? '#D9E7EC' : '#E8DFCA'}
                    borderRadius={'1.25rem'}
                  >
                    <Text
                      color={payStatus === 2 ? '#66809C' : '#A87C4E'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                      textAlign={'center'}
                    >
                      {handleGetPaymentStatus(payStatus)}
                    </Text>
                  </Box>
                  <Box>
                    <Button
                      onClick={() => {
                        handleDetail(orders);
                      }}
                      px={0}
                    >
                      <HStack spacing={'0.5rem'}>
                        <Text
                          fontSize={'1rem'}
                          fontWeight={400}
                          color={'#556A7E'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.DETAILS)}
                        </Text>
                        <Img
                          w={'1.25rem'}
                          h={'1.25rem'}
                          src={RightBlueArrow.src}
                        />
                      </HStack>
                    </Button>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.25rem'}>
                  <Box w={'100%'}>
                    <HStack spacing={'1.25rem'}>
                      <Box>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.9375, 1)}
                          fontWeight={400}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DATE)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.9375, 1)}
                          fontWeight={400}
                        >
                          {utils.parseDateByCountryCode(createdAt, lang, true)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  <Box w={'100%'}>
                    <HStack spacing={'1.25rem'}>
                      <Box>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.9375, 1)}
                          fontWeight={400}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_NUMBER)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.9375, 1)}
                          fontWeight={500}
                        >
                          {orderNum}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack>
                  <Box>
                    <Text
                      fontSize={clampW(0.9375, 1)}
                      fontWeight={400}
                      color={'#556A7E'}
                    >
                      {brandName}
                    </Text>
                  </Box>
                  <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box w={'33%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'auto'} h={'2.75rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 0.9375)}
                          fontWeight={500}
                          textAlign={'center'}
                          whiteSpace={'pre-wrap'}
                        >
                          {localeText(LANGUAGES.ORDER.TOTAL_ORDER_PRICE)}
                        </Text>
                      </Box>
                      <Box w={'auto'} h={'1.5rem'}>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.9375, 1)}
                          fontWeight={500}
                          textAlign={'center'}
                        >
                          {utils.parseDallar(totalAmount)}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                  <Box w={'31%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'auto'} h={'2.75rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 0.9375)}
                          fontWeight={500}
                          textAlign={'center'}
                          whiteSpace={'pre-wrap'}
                        >
                          {localeText(LANGUAGES.ORDER.DISCOUNT_PRICE)}
                        </Text>
                      </Box>
                      <Box w={'auto'} h={'1.5rem'}>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.9375, 1)}
                          fontWeight={500}
                          textAlign={'center'}
                        >
                          {utils.parseDallar(discountAmount)}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                  <Box w={'33%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'auto'} h={'2.75rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 0.9375)}
                          fontWeight={500}
                          textAlign={'center'}
                          whiteSpace={'pre-wrap'}
                        >
                          {localeText(LANGUAGES.ORDER.FINAL_ORDER_PRICE)}
                        </Text>
                      </Box>
                      <Box w={'auto'} h={'1.5rem'}>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.9375, 1)}
                          fontWeight={500}
                          textAlign={'center'}
                        >
                          {utils.parseDallar(actualAmount)}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </HStack>
              </Box>

              {ordersProducts.map((orderProduct, index) => {
                const target = orderProduct;
                const count = target.count;
                const deliveryStatus = target.deliveryStatus;
                const name = target.name || '';
                const ordersProductId = target.ordersProductId;
                const ordersProductOptionList =
                  target.ordersProductOptionList || [];
                const productId = target.productId;
                const productImageList = target?.productImageList || [];
                // totalPrice = target.totalPrice;
                const unitPrice = target.unitPrice;

                const partsPrice = totalAmount + unitPrice;

                return (
                  <Box w={'100%'} key={index}>
                    <VStack spacing={'1.5rem'}>
                      <Box w={'100%'}>
                        <HStack>
                          <Box
                            minW={'6.25rem'}
                            w={'6.25rem'}
                            h={'6.25rem'}
                            overflow={'hidden'}
                          >
                            <AutoImageSlider images={productImageList} />
                          </Box>
                          <Box>
                            <VStack spacing={'0.75rem'}>
                              <Box w={'100%'}>
                                <VStack spacing={0}>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#485766'}
                                      fontSize={'1rem'}
                                      fontWeight={500}
                                      lineHeight={'1.75rem'}
                                    >
                                      {name}
                                    </Text>
                                  </Box>
                                  <Box w={'100%'}>
                                    <VStack alignItems={'flex-start'}>
                                      {ordersProductOptionList.map(
                                        (option, optionIndex) => {
                                          return (
                                            <Text
                                              key={optionIndex}
                                              color={'#66809C'}
                                              fontSize={'0.9375rem'}
                                              fontWeight={400}
                                              lineHeight={'1.5rem'}
                                              textAlign={'left'}
                                            >
                                              {`${localeText(LANGUAGES.COMMON.OPTION)} : ${option.name}`}
                                            </Text>
                                          );
                                        },
                                      )}
                                    </VStack>
                                  </Box>
                                </VStack>
                              </Box>
                              <Box w={'100%'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {`${utils.parseDallar(partsPrice)} / ${count}${localeText(LANGUAGES.ORDER.EA)}`}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                        </HStack>
                      </Box>

                      <Box w={'100%'}>
                        <VStack spacing={'0.5rem'}>
                          <Box w={'100%'}>
                            <Text
                              textAlign={'center'}
                              color={'#485766'}
                              fontSize={'1.125rem'}
                              fontWeight={600}
                              lineHeight={'1.96875rem'}
                              whiteSpace={'pre-wrap'}
                            >
                              {handleDeliveryStatus(status)}
                            </Text>
                          </Box>
                          <Center w={'100%'}>
                            {handleDeliveryBntByStatus(orders, target)}
                          </Center>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        </VStack>
      </Box>
    ) : (
      <Box w={'100%'} key={rowIndex}>
        <VStack spacing={'1.25rem'}>
          <Box
            w={'100%'}
            py={'1.25rem'}
            borderTop={'1px solid #576076'}
            borderBottom={'1px solid #AEBDCA'}
            boxSizing={'border-box'}
          >
            <HStack justifyContent={'space-between'}>
              <Box>
                <HStack spacing={'1.25rem'}>
                  <Box>
                    <HStack>
                      <Box
                        px={'1rem'}
                        py={'0.5rem'}
                        // w={'6.4rem'}
                        h={'2.5rem'}
                        bg={payStatus === 2 ? '#D9E7EC' : '#E8DFCA'}
                        borderRadius={'1.25rem'}
                      >
                        <Text
                          color={payStatus === 2 ? '#66809C' : '#A87C4E'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                          textAlign={'center'}
                        >
                          {handleGetPaymentStatus(payStatus)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#7895B2'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DATE)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {utils.parseDateByCountryCode(createdAt, lang, true)}
                    </Text>
                  </Box>
                  <Box
                    w={'1px'}
                    h={'1.25rem'}
                    borderRight={'1px solid #AEBDCA'}
                  />
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_NUMBER)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {orderNum}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box>
                <Button
                  onClick={() => {
                    handleDetail(orders);
                  }}
                >
                  <HStack spacing={'0.5rem'}>
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {localeText(LANGUAGES.MY_PAGE.ORDER.DETAILS)}
                    </Text>
                    <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
                  </HStack>
                </Button>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack>
                  <Box>
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {brandName}
                    </Text>
                  </Box>
                  <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
                </HStack>
              </Box>

              {ordersProducts.map((orderProduct, index) => {
                const target = orderProduct;
                const count = target.count;
                const deliveryStatus = target.deliveryStatus;
                const name = target.name;
                const ordersProductId = target.ordersProductId;
                const productId = target.productId;
                const productImageList = target?.productImageList || [];
                // totalPrice = target.totalPrice;
                const unitPrice = target.unitPrice;
                const ordersProductOptionList =
                  target.ordersProductOptionList || [];

                let firstOption = null;
                let optionUnitPrice = 0;
                if (ordersProductOptionList.length > 0) {
                  firstOption = ordersProductOptionList[0];
                  optionUnitPrice = firstOption.unitPrice;
                }
                const partsPrice = unitPrice + optionUnitPrice;
                return (
                  <Box w={'100%'} overflowX={'auto'} key={index}>
                    <HStack justifyContent={'space-between'}>
                      <Box
                        width={'100%'}
                        cursor={'pointer'}
                        onClick={() => {
                          if (productId) {
                            moveProductDetail(productId);
                          }
                        }}
                      >
                        <HStack>
                          <Box
                            minW={'6.25rem'}
                            w={'6.25rem'}
                            h={'6.25rem'}
                            overflow={'hidden'}
                          >
                            <AutoImageSlider images={productImageList} />
                          </Box>
                          <Box>
                            <VStack spacing={'0.75rem'}>
                              <Box w={'100%'}>
                                <VStack spacing={0}>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#485766'}
                                      fontSize={'1rem'}
                                      fontWeight={500}
                                      lineHeight={'1.75rem'}
                                    >
                                      {name}
                                    </Text>
                                  </Box>
                                  <Box w={'100%'}>
                                    <VStack alignItems={'flex-start'}>
                                      {ordersProductOptionList.map(
                                        (option, optionIndex) => {
                                          return (
                                            <Text
                                              key={optionIndex}
                                              color={'#66809C'}
                                              fontSize={'0.9375rem'}
                                              fontWeight={400}
                                              lineHeight={'1.5rem'}
                                              textAlign={'left'}
                                            >
                                              {`${localeText(LANGUAGES.COMMON.OPTION)} : ${option.name}`}
                                            </Text>
                                          );
                                        },
                                      )}
                                    </VStack>
                                  </Box>
                                </VStack>
                              </Box>
                              <Box w={'100%'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {`${utils.parseDallar(partsPrice)} / ${count}${localeText(LANGUAGES.ORDER.EA)}`}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                        </HStack>
                      </Box>
                      <Box>
                        <HStack spacing={'0.75rem'}>
                          <Box w={'7.875rem'}>
                            <VStack spacing={'0.75rem'}>
                              <Box w={'100%'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  {localeText(
                                    LANGUAGES.ORDER.TOTAL_ORDER_PRICE,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'100%'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {utils.parseDallar(totalAmount)}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                          <Box w={'6.75rem'}>
                            <VStack spacing={'0.75rem'}>
                              <Box w={'100%'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.DISCOUNT_PRICE)}
                                </Text>
                              </Box>
                              <Box w={'100%'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {utils.parseDallar(discountAmount)}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                          <Box w={'7.6875rem'}>
                            <VStack spacing={'0.75rem'}>
                              <Box w={'100%'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  {localeText(
                                    LANGUAGES.ORDER.FINAL_ORDER_PRICE,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'100%'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {utils.parseDallar(actualAmount)}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                          <Box px={'1.25rem'}>
                            <VStack spacing={'1rem'}>
                              <Box w={'100%'}>
                                <Text
                                  textAlign={'center'}
                                  color={'#485766'}
                                  fontSize={'1.125rem'}
                                  fontWeight={600}
                                  lineHeight={'1.96875rem'}
                                  whiteSpace={'pre-wrap'}
                                >
                                  {handleDeliveryStatus(status)}
                                </Text>
                              </Box>
                              <Center w={'100%'}>
                                {handleDeliveryBntByStatus(orders, target)}
                              </Center>
                            </VStack>
                          </Box>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <MyPageOrderLayout>
      <VStack spacing={'1.5rem'}>
        <Box w={'100%'}>
          <Text color={'#485766'} fontSize={clampW(1.25, 1.5)} fontWeight={500}>
            {localeText(LANGUAGES.ORDER.RECENT_ORDERS)}
          </Text>
        </Box>

        <Box w={'100%'}>
          {listOrder.length !== 0 && (
            <>
              <VStack spacing={'1.25rem'}>
                {listOrder.map((orders, index) => {
                  return orderCardRow(orders, index);
                })}
              </VStack>

              {/* <ContentBR h={'1.25rem'} /> */}

              {/* <Divider borderBottom={'1px solid #576076'} /> */}

              {/* <ContentBR h={'5rem'} borderBottom={'1px soild red'} /> */}
            </>
          )}
          {listOrder.length === 0 && (
            <Center w={'100%'} h={'10rem'}>
              <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
                {localeText(LANGUAGES.INFO_MSG.NO_ORDER_DETAILS)}
              </Text>
            </Center>
          )}
        </Box>
      </VStack>
    </MyPageOrderLayout>
  ) : (
    <MyPageOrderLayout>
      <VStack spacing={0}>
        <Box w={'100%'} py={'5rem'} pb={'3.75rem'}>
          <Text
            textAlign={'left'}
            color={'#485766'}
            fontSize={'1.5rem'}
            fontWeight={500}
            lineHeight={'2.475rem'}
          >
            {localeText(LANGUAGES.ORDER.RECENT_ORDERS)}
          </Text>
        </Box>

        <Box w={'100%'}>
          {listOrder.length !== 0 && (
            <>
              <VStack spacing={'1.25rem'}>
                {listOrder.map((orders, index) => {
                  return orderCardRow(orders, index);
                })}
              </VStack>

              <ContentBR h={'1.25rem'} />

              <Divider borderBottom={'1px solid #576076'} />

              <ContentBR h={'5rem'} borderBottom={'1px soild red'} />

              <Center>
                <Box>
                  <DefaultPaginate
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalCount={totalCount}
                    contentNum={contentNum}
                  />
                </Box>
              </Center>
            </>
          )}
          {listOrder.length === 0 && (
            <Center w={'100%'} h={'10rem'}>
              <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
                {localeText(LANGUAGES.INFO_MSG.NO_ORDER_DETAILS)}
              </Text>
            </Center>
          )}
        </Box>
      </VStack>
    </MyPageOrderLayout>
  );
};

export default OrderHistoryPage;
