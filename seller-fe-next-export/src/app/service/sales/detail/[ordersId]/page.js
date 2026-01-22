'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import ordersApi from '@/services/ordersApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import useMove from '@/hooks/useMove';
import useStatus from '@/hooks/useStatus';
import useDevice from '@/hooks/useDevice';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import useModal from '@/hooks/useModal';

const SalesDetailPage = () => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const { ordersId } = useParams();
  const { moveProductDetail } = useMove();
  const { lang, localeText } = useLocale();
  const { handleGetDeliveryStatus, handleGetPaymentStatus } = useStatus();

  const [note, setNote] = useState('');

  const [ordersInfo, setOrdersInfo] = useState({});
  const [listOrdersDetail, setListOrdersDetail] = useState([]);

  useEffect(() => {
    if (ordersId) {
      handleGetOrders();
    }
  }, [ordersId]);

  const handleGetOrders = async () => {
    const param = {
      ordersId: ordersId,
    };
    const result = await ordersApi.getOrders(param);

    if (result?.errorCode === SUCCESS) {
      const info = result.data;
      setOrdersInfo(info);
      if (info?.memo) {
        setNote(info.memo);
      }
      if (info?.ordersProductListForDetail) {
        setListOrdersDetail(info.ordersProductListForDetail);
      }
    }
  };

  const orderCardRow = useCallback((order, index) => {
    const name = order?.name || '';
    const count = order?.count || 0;
    const productId = order?.productId || null;
    const unitPrice = order?.unitPrice || 0;
    const totalPrice = order?.totalPrice || 0;
    const ordersProductId = order?.ordersProductId || null;
    const deliveryStatus = order?.deliveryStatus || null;
    // const status = order?.status || null;
    const status = ordersInfo.status;
    const trackingNum = order?.trackingNum || '';

    const productImageList = order?.productImageList || [];
    let firstImage = null;
    if (productImageList.length > 0) {
      firstImage = productImageList[0].imageS3Url;
    }

    let firstOption = null;
    const ordersProductOptionList = order?.ordersProductOptionList || [];
    if (ordersProductOptionList.length > 0) {
      firstOption = ordersProductOptionList[0];
    }

    return isMobile(true) ? (
      <Box w={'100%'} key={index}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Box
            cursor={'pointer'}
            onClick={() => {
              moveProductDetail(productId);
            }}
          >
            <HStack
              justifyContent={'flex-start'}
              alignItems={'center'}
              spacing={'1.25rem'}
            >
              <Box w={'5rem'} aspectRatio={1}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={firstImage}
                />
              </Box>

              <Box>
                <VStack
                  justifyContent={'center'}
                  alignItems={'flex-start'}
                  spacing={'0.25rem'}
                >
                  <VStack
                    flexDirection={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    gap={1}
                  >
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {name}
                    </Text>

                    <Box>
                      <HStack
                        spacing={'0.25rem'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                      >
                        <Box>
                          <Text
                            color={'#66809C'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {`${localeText(LANGUAGES.COMMON.OPTION)}: `}
                          </Text>
                        </Box>
                        <Box>
                          <VStack alignItems={'flex-start'} spacing={'0.75rem'}>
                            {ordersProductOptionList.map((item, index) => {
                              return (
                                <Box key={index}>
                                  <Text
                                    color={'#66809C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={400}
                                    lineHeight={'1.5rem'}
                                  >
                                    {`${item.name} (+${utils.parseDallar(item.unitPrice)})`}
                                  </Text>
                                </Box>
                              );
                            })}
                          </VStack>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </VStack>
              </Box>
            </HStack>
          </Box>

          <Box>
            <HStack>
              {/* Price */}
              <VStack
                w={'8.75rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SALES.PRODUCT_PRICE)}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {utils.parseDallar(unitPrice)}
                </Text>
              </VStack>

              {/* Quantity */}
              <VStack
                w={'6.25rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.ORDER.QUANTITY)}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {utils.parseAmount(count)}
                </Text>
              </VStack>

              {/* Total */}
              <VStack
                w={'6.25rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.ORDER.TOTAL)}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {utils.parseDallar(totalPrice)}
                </Text>
              </VStack>

              {/* Order status */}
              <VStack
                w={'10rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SALES.ORDER_STATUS).replace('\n', ' ')}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {handleGetDeliveryStatus(status)}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </HStack>
      </Box>
    ) : (
      <Box w={'100%'} key={index}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Box
            cursor={'pointer'}
            onClick={() => {
              moveProductDetail(productId);
            }}
          >
            <HStack
              justifyContent={'flex-start'}
              alignItems={'center'}
              spacing={'1.25rem'}
            >
              <Box w={'5rem'} aspectRatio={1}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={firstImage}
                />
              </Box>

              <Box>
                <VStack
                  justifyContent={'center'}
                  alignItems={'flex-start'}
                  spacing={'0.25rem'}
                >
                  <VStack
                    flexDirection={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    gap={1}
                  >
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {name}
                    </Text>

                    <Box>
                      <HStack
                        spacing={'0.25rem'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                      >
                        <Box>
                          <Text
                            color={'#66809C'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {`${localeText(LANGUAGES.COMMON.OPTION)}: `}
                          </Text>
                        </Box>
                        <Box>
                          <VStack alignItems={'flex-start'} spacing={'0.75rem'}>
                            {ordersProductOptionList.map((item, index) => {
                              return (
                                <Box key={index}>
                                  <Text
                                    color={'#66809C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={400}
                                    lineHeight={'1.5rem'}
                                  >
                                    {`${item.name} (+${utils.parseDallar(item.unitPrice)})`}
                                  </Text>
                                </Box>
                              );
                            })}
                          </VStack>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </VStack>
              </Box>
            </HStack>
          </Box>

          <Box>
            <HStack>
              {/* Price */}
              <VStack
                w={'8.75rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SALES.PRODUCT_PRICE)}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {utils.parseDallar(unitPrice)}
                </Text>
              </VStack>

              {/* Quantity */}
              <VStack
                w={'6.25rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.ORDER.QUANTITY)}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {utils.parseAmount(count)}
                </Text>
              </VStack>

              {/* Total */}
              <VStack
                w={'6.25rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.ORDER.TOTAL)}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {utils.parseDallar(totalPrice)}
                </Text>
              </VStack>

              {/* Order status */}
              <VStack
                w={'10rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={1}
              >
                <Text
                  textAlign={'center'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SALES.ORDER_STATUS).replace('\n', ' ')}
                </Text>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {handleGetDeliveryStatus(status)}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </HStack>
      </Box>
    );
  });

  const handlePatchProduct = async () => {
    if (utils.isEmpty(note)) {
      openModal({
        text: localeText(LANGUAGES.SALES.PH_ENTER_NOTE),
      });
      return;
    }
    const param = {
      ordersId: ordersInfo.ordersId,
      memo: note,
    };
    const result = await ordersApi.patchOrders(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          handleGetOrders();
        },
      });
    } else {
      openModal({ text: result.message });
    }
  };

  return isMobile(true) ? (
    <MainContainer isDetailHeader>
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'} px={clampW(1, 5)}>
          <Box w={'100%'} py={'0.75rem'} boxSizing={'border-box'}>
            <Box w={'100%'}>
              <VStack spacing={'0.75rem'} alignItems={'flex-start'}>
                <Box
                  px={'1rem'}
                  py={'0.5rem'}
                  bg={'#D9E7EC'}
                  borderRadius={'1.25rem'}
                >
                  <Text
                    color={'#66809C'}
                    fontSize={'0.9375rem'}
                    fontWeight={500}
                    lineHeight={'1.5rem'}
                    textAlign={'center'}
                  >
                    {handleGetPaymentStatus(ordersInfo.payStatus)}
                  </Text>
                </Box>

                <Box w={'max-content'}>
                  <HStack spacing={'1.25rem'}>
                    <Box w={'max-content'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DETE)}
                      </Text>
                    </Box>
                    <Box w={'max-content'}>
                      <Text
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {utils.parseDateByCountryCode(
                          ordersInfo.createdAt,
                          lang,
                        )}
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                <Box w={'max-content'}>
                  <HStack spacing={'1.25rem'}>
                    <Box w={'max-content'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_NUMBER)}
                      </Text>
                    </Box>
                    <Box w={'max-content'}>
                      <Text
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        {ordersInfo.orderNum}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          <Box w={'100%'} overflowX={'auto'}>
            <VStack spacing={'1.25rem'} w={'60rem'}>
              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  {listOrdersDetail.map((order, index) => {
                    return orderCardRow(order, index);
                  })}
                </VStack>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />
            </VStack>
          </Box>

          <Box
            w={'100%'}
            p={'1.25rem'}
            bg={'#90aec412'}
            flexDirection={'column'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            gap={5}
            display={'inline-flex'}
          >
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'1.125rem'}
              fontWeight={500}
              lineHeight={'1.96875rem'}
            >
              {localeText(LANGUAGES.SALES.PAYMENT_INFO)}
            </Text>

            <VStack
              alignSelf={'stretch'}
              flexDirection={'column'}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              spacing={'1rem'}
              display={'flex'}
            >
              <VStack
                alignSelf={'stretch'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                gap={5}
                display={'inline-flex'}
              >
                {/* Left Side */}
                <VStack
                  w={'100%'}
                  flexDirection={'column'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  gap={3}
                  display={'inline-flex'}
                >
                  <HStack
                    alignSelf={'stretch'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    display={'inline-flex'}
                  >
                    <Text
                      w={'10rem'}
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                    </Text>
                    <Text
                      textAlign={'right'}
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {utils.parseDallar(ordersInfo.totalAmount)}
                    </Text>
                  </HStack>
                  <HStack
                    alignSelf={'stretch'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    display={'inline-flex'}
                  ></HStack>
                </VStack>

                {/* Right Side */}
                <VStack
                  w={'100%'}
                  flex={1}
                  flexDirection={'column'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  gap={3}
                  display={'inline-flex'}
                >
                  <HStack
                    alignSelf={'stretch'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    display={'inline-flex'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ORDER.COUPON_DISCOUNT)}
                    </Text>
                    <Text
                      textAlign={'right'}
                      color={'#940808'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {`-${utils.parseDallar(ordersInfo.couponDiscountAmount)}`}
                    </Text>
                  </HStack>
                  <HStack
                    alignSelf={'stretch'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    display={'inline-flex'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ORDER.REDEEMING_MILES)}
                    </Text>
                    <Text
                      textAlign={'right'}
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {`${ordersInfo.rewardDiscountAmount} ${localeText(LANGUAGES.ORDER.COIN)}`}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>

              {/* Divider line */}
              <Divider borderTop={'1px solid #AEBDCA'} />

              <VStack
                w={'100%'}
                alignSelf={'stretch'}
                h={'4.25rem'} // 68px -> 4.25rem
                flexDirection={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                gap={3}
                display={'flex'}
              >
                <HStack
                  w={'100%'}
                  alignSelf={'stretch'}
                  justifyContent={'space-between'}
                  display={'inline-flex'}
                >
                  <Text
                    color={'#66809C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.ORDER.ORDER_TOTAL)}
                  </Text>
                  <Text
                    flex={1}
                    textAlign={'right'}
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={600}
                    lineHeight={'1.75rem'}
                  >
                    {utils.parseDallar(ordersInfo.totalAmount)}
                  </Text>
                </HStack>

                <HStack
                  w={'100%'}
                  alignSelf={'stretch'}
                  justifyContent={'space-between'}
                  display={'inline-flex'}
                >
                  <Text
                    color={'#66809C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.PRODUCTS.DISCOUNT)}
                  </Text>
                  <Text
                    flex={1}
                    textAlign={'right'}
                    color={'#940808'}
                    fontSize={'1rem'}
                    fontWeight={600}
                    lineHeight={'1.75rem'}
                  >
                    {`-${utils.parseDallar(ordersInfo.discountAmount)}`}
                  </Text>
                </HStack>
              </VStack>

              {/* Divider line */}
              <Divider borderTop={'1px solid #AEBDCA'} />

              <HStack
                w={'100%'}
                alignSelf={'stretch'}
                justifyContent={'space-between'}
                display={'inline-flex'}
              >
                <Text
                  color={'#66809C'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {`${localeText(LANGUAGES.SALES.FINAL_PAYMENT_AMOUNT)} (${localeText(LANGUAGES.COMMON.CARD)})`}
                </Text>
                <Text
                  flex={1}
                  textAlign={'right'}
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={600}
                  lineHeight={'1.75rem'}
                >
                  {utils.parseDallar(ordersInfo.actualAmount)}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Box
            w={'100%'}
            p={'1.25rem'}
            bg="#90aec412"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap="1.25rem"
            display="inline-flex"
          >
            <Text
              textAlign="center"
              color="#485766"
              fontSize="1.125rem"
              fontWeight={500}
              lineHeight="1.96875rem"
            >
              {localeText(LANGUAGES.ORDER.ORDERER_INFO)}
            </Text>
            <VStack w="100%" gap="1rem" alignItems="flex-start">
              <VStack
                w="100%"
                spacing={0}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ORDER.ORDERER_NAME)}
                </Text>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={500}
                  lineHeight="1.5rem"
                >
                  {ordersInfo.buyerName}
                </Text>
              </VStack>
              <VStack
                w="100%"
                spacing={0}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                </Text>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={500}
                  lineHeight="1.5rem"
                >
                  {utils.parsePhoneNum(ordersInfo.buyerPhone)}
                </Text>
              </VStack>
              <VStack
                w="100%"
                spacing={0}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ACC.EMAIL)}
                </Text>
                <Text
                  w="auto"
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={500}
                  lineHeight="1.5rem"
                >
                  {ordersInfo.buyerId}
                </Text>
              </VStack>
            </VStack>
          </Box>

          <Box
            w={'100%'}
            p="1.25rem"
            bg="#90aec412"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap="1.25rem"
            display="inline-flex"
          >
            <Text
              textAlign="center"
              color="#485766"
              fontSize="1.125rem"
              fontWeight={500}
              lineHeight="1.96875rem"
            >
              {localeText(LANGUAGES.ORDER.SHIPPING_INFO)}
            </Text>
            <VStack w="100%" spacing="1rem" alignItems="flex-start">
              <VStack
                w="100%"
                spacing={0}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ACC.NAME)}
                </Text>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={500}
                  lineHeight="1.5rem"
                >
                  {ordersInfo.name || ordersInfo.buyerName}
                </Text>
              </VStack>
              <VStack
                w="100%"
                spacing={0}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                </Text>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={500}
                  lineHeight="1.5rem"
                >
                  {utils.parsePhoneNum(
                    ordersInfo.phone || ordersInfo.buyerPhone,
                  )}
                </Text>
              </VStack>
              <VStack
                w="100%"
                spacing={0}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ADDRESS)}
                </Text>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={500}
                  lineHeight="1.5rem"
                >
                  {`${ordersInfo.state} ${ordersInfo.city} ${
                    ordersInfo.addressLineOne || ordersInfo.roadNameMainAddr
                  } ${ordersInfo.addressLineTwo || ordersInfo.subAddr} ${ordersInfo.zipCode}`}
                </Text>
              </VStack>
              <VStack
                w="100%"
                spacing={0}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ORDER.MESSAGES)}
                </Text>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={500}
                  lineHeight="1.5rem"
                >
                  {ordersInfo.ordersMemo}
                </Text>
              </VStack>
            </VStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'} alignItems="flex-start">
              <HStack
                w="100%"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  color="#485766"
                  fontSize="1.125rem"
                  fontWeight={500}
                  lineHeight="1.96875rem"
                >
                  {localeText(LANGUAGES.SALES.NOTES)}
                </Text>
                <Button
                  w={'7rem'}
                  h={'3rem'}
                  p={'0.625rem 1.25rem'}
                  bg={'#7895B2'}
                  borderRadius={'0.25rem'}
                  onClick={() => {
                    handlePatchProduct();
                  }}
                >
                  <Text
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                    color={'#FFF'}
                  >
                    {localeText(LANGUAGES.COMMON.SAVE)}
                  </Text>
                </Button>
              </HStack>
              <Box w={'100%'} h={'7.75rem'}>
                <Textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                  p={'0.875rem'}
                  w={'100%'}
                  h={'100%'}
                  resize={'none'}
                  placeholder={localeText(LANGUAGES.SALES.PH_ENTER_NOTE)}
                  borderRadius={'0.25rem'}
                  border={'1px solid #9CADBE'}
                />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
      <ContentBR h={'1.25rem'} />
    </MainContainer>
  ) : (
    <MainContainer isDetailHeader>
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'}>
          <Box>
            <VStack spacing={'1.25rem'}>
              <Box
                w={'100%'}
                h={'4rem'}
                py={'0.75rem'}
                boxSizing={'border-box'}
                borderTop={'1px solid #576076'}
                borderBottom={'1px solid #AEBDCA'}
              >
                <Box w={'100%'}>
                  <HStack spacing={'1.25rem'} justifyContent={'space-between'}>
                    <Box>
                      <HStack spacing={'1.25rem'}>
                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Box w={'max-content'}>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DETE)}
                              </Text>
                            </Box>
                            <Box w={'max-content'}>
                              <Text
                                color={'#485766'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {utils.parseDateByCountryCode(
                                  ordersInfo.createdAt,
                                  lang,
                                )}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>

                        <Divider
                          h={'1.25rem'}
                          borderRight={'1px solid #AEBDCA'}
                        />

                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Box w={'max-content'}>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(
                                  LANGUAGES.MY_PAGE.ORDER.ORDER_NUMBER,
                                )}
                              </Text>
                            </Box>
                            <Box w={'max-content'}>
                              <Text
                                color={'#485766'}
                                fontSize={'0.9375rem'}
                                fontWeight={500}
                                lineHeight={'1.5rem'}
                              >
                                {ordersInfo.orderNum}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>

                    <Box
                      px={'1rem'}
                      py={'0.5rem'}
                      bg={'#D9E7EC'}
                      borderRadius={'1.25rem'}
                    >
                      <Text
                        color={'#66809C'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                        textAlign={'center'}
                      >
                        {handleGetPaymentStatus(ordersInfo.payStatus)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  {listOrdersDetail.map((order, index) => {
                    return orderCardRow(order, index);
                  })}
                </VStack>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box
                w={'72.75rem'} // 1164px -> 72.75rem
                h={'19.5rem'} // 312px -> 19.5rem
                p={5}
                bg={'#90aec412'}
                flexDirection={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                gap={5}
                display={'inline-flex'}
              >
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.SALES.PAYMENT_INFO)}
                </Text>

                <VStack
                  alignSelf={'stretch'}
                  h={'13.75rem'}
                  flexDirection={'column'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  spacing={'1rem'}
                  display={'flex'}
                >
                  <HStack
                    alignSelf={'stretch'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    gap={5}
                    display={'inline-flex'}
                  >
                    {/* Left Side */}
                    <VStack
                      flex={1}
                      flexDirection={'column'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={3}
                      display={'inline-flex'}
                    >
                      <HStack
                        alignSelf={'stretch'}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        display={'inline-flex'}
                      >
                        <Text
                          w={'10rem'}
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                        </Text>
                        <Text
                          textAlign={'right'}
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {utils.parseDallar(ordersInfo.totalAmount)}
                        </Text>
                      </HStack>
                      <HStack
                        alignSelf={'stretch'}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        display={'inline-flex'}
                      >
                        {/* <Text
                          w={'10rem'}
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.ORDER.TOTAL_SHIPPING)}
                        </Text>
                        <Text
                          textAlign={'right'}
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          $3.00
                        </Text> */}
                      </HStack>
                    </VStack>

                    {/* Vertical divider */}
                    <Box
                      w={'3.75rem'}
                      transform={'rotate(90deg)'}
                      transformOrigin={'0 0'}
                      border={'1px #AEBDCA solid'}
                    />

                    {/* Right Side */}
                    <VStack
                      flex={1}
                      flexDirection={'column'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={3}
                      display={'inline-flex'}
                    >
                      <HStack
                        alignSelf={'stretch'}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        display={'inline-flex'}
                      >
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.ORDER.COUPON_DISCOUNT)}
                        </Text>
                        <Text
                          textAlign={'right'}
                          color={'#940808'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {`-${utils.parseDallar(ordersInfo.couponDiscountAmount)}`}
                        </Text>
                      </HStack>
                      <HStack
                        alignSelf={'stretch'}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        display={'inline-flex'}
                      >
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.ORDER.REDEEMING_MILES)}
                        </Text>
                        <Text
                          textAlign={'right'}
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {`${ordersInfo.rewardDiscountAmount} ${localeText(LANGUAGES.ORDER.COIN)}`}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>

                  {/* Divider line */}
                  <Divider borderTop={'1px solid #AEBDCA'} />

                  <VStack
                    alignSelf={'stretch'}
                    h={'4.25rem'} // 68px -> 4.25rem
                    flexDirection={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    gap={3}
                    display={'flex'}
                  >
                    <HStack
                      alignSelf={'stretch'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={8} // 32px -> 2rem
                      display={'inline-flex'}
                    >
                      <Text
                        color={'#66809C'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ORDER.ORDER_TOTAL)}
                      </Text>
                      <Text
                        flex={1}
                        textAlign={'right'}
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={600}
                        lineHeight={'1.75rem'}
                      >
                        {utils.parseDallar(ordersInfo.totalAmount)}
                      </Text>
                    </HStack>

                    <HStack
                      alignSelf={'stretch'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={8} // 32px -> 2rem
                      display={'inline-flex'}
                    >
                      <Text
                        color={'#66809C'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ORDER.DISCOUNT)}
                      </Text>
                      <Text
                        flex={1}
                        textAlign={'right'}
                        color={'#940808'}
                        fontSize={'1rem'}
                        fontWeight={600}
                        lineHeight={'1.75rem'}
                      >
                        {`-${utils.parseDallar(ordersInfo.discountAmount)}`}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Divider line */}
                  <Divider borderTop={'1px solid #AEBDCA'} />

                  <HStack
                    alignSelf={'stretch'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    gap={8} // 32px -> 2rem
                    display={'inline-flex'}
                  >
                    <Text
                      color={'#66809C'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {`${localeText(LANGUAGES.SALES.FINAL_PAYMENT_AMOUNT)} (${localeText(LANGUAGES.COMMON.CARD)})`}
                    </Text>
                    <Text
                      flex={1}
                      textAlign={'right'}
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={600}
                      lineHeight={'1.75rem'}
                    >
                      {utils.parseDallar(ordersInfo.actualAmount)}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Box w={'100%'}>
                <HStack
                  h={'17.75rem'}
                  spacing={'1.25rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box
                    h={'100%'}
                    flex="1 1 0"
                    p="1.25rem"
                    bg="#90aec412"
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    gap="1.25rem"
                    display="inline-flex"
                  >
                    <Text
                      textAlign="center"
                      color="#485766"
                      fontSize="1.125rem"
                      fontWeight={500}
                      lineHeight="1.96875rem"
                    >
                      {localeText(LANGUAGES.ORDER.ORDERER_INFO)}
                    </Text>
                    <VStack
                      w="100%"
                      h="6.5rem"
                      gap="1rem"
                      alignItems="flex-start"
                    >
                      <HStack
                        w="100%"
                        spacing="2rem"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Text
                          w="10rem"
                          color="#7895B2"
                          fontSize="0.9375rem"
                          fontWeight={400}
                          lineHeight="1.5rem"
                        >
                          {localeText(LANGUAGES.ORDER.ORDERER_NAME)}
                        </Text>
                        <Text
                          color="#556A7E"
                          fontSize="0.9375rem"
                          fontWeight={500}
                          lineHeight="1.5rem"
                        >
                          {ordersInfo.buyerName}
                        </Text>
                      </HStack>
                      <HStack
                        w="100%"
                        spacing="2rem"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Text
                          w="10rem"
                          color="#7895B2"
                          fontSize="0.9375rem"
                          fontWeight={400}
                          lineHeight="1.5rem"
                        >
                          {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                        </Text>
                        <Text
                          color="#556A7E"
                          fontSize="0.9375rem"
                          fontWeight={500}
                          lineHeight="1.5rem"
                        >
                          {utils.parsePhoneNum(ordersInfo.buyerPhone)}
                        </Text>
                      </HStack>
                      <HStack
                        w="100%"
                        spacing="2rem"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Text
                          w="10rem"
                          color="#7895B2"
                          fontSize="0.9375rem"
                          fontWeight={400}
                          lineHeight="1.5rem"
                        >
                          {localeText(LANGUAGES.ACC.EMAIL)}
                        </Text>
                        <Text
                          w="auto"
                          color="#556A7E"
                          fontSize="0.9375rem"
                          fontWeight={500}
                          lineHeight="1.5rem"
                        >
                          {ordersInfo.buyerId}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                  <Box
                    flex="1 1 0"
                    p="1.25rem"
                    bg="#90aec412"
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    gap="1.25rem"
                    display="inline-flex"
                  >
                    <Text
                      textAlign="center"
                      color="#485766"
                      fontSize="1.125rem"
                      fontWeight={500}
                      lineHeight="1.96875rem"
                    >
                      {localeText(LANGUAGES.ORDER.SHIPPING_INFO)}
                    </Text>
                    <VStack
                      w="100%"
                      h="12rem"
                      spacing="1rem"
                      alignItems="flex-start"
                    >
                      <HStack
                        w="100%"
                        spacing="2rem"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Text
                          w="10rem"
                          color="#7895B2"
                          fontSize="0.9375rem"
                          fontWeight={400}
                          lineHeight="1.5rem"
                        >
                          {localeText(LANGUAGES.ACC.NAME)}
                        </Text>
                        <Text
                          w={'21.25rem'}
                          color="#556A7E"
                          fontSize="0.9375rem"
                          fontWeight={500}
                          lineHeight="1.5rem"
                        >
                          {ordersInfo.name || ordersInfo.buyerName}
                        </Text>
                      </HStack>
                      <HStack
                        w="100%"
                        spacing="2rem"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Text
                          w={'10rem'}
                          color="#7895B2"
                          fontSize="0.9375rem"
                          fontWeight={400}
                          lineHeight="1.5rem"
                        >
                          {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                        </Text>
                        <Text
                          w={'21.25rem'}
                          color="#556A7E"
                          fontSize="0.9375rem"
                          fontWeight={500}
                          lineHeight="1.5rem"
                        >
                          {utils.parsePhoneNum(
                            ordersInfo.phone || ordersInfo.buyerPhone,
                          )}
                        </Text>
                      </HStack>
                      <HStack
                        w="100%"
                        spacing="2rem"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Text
                          w="10rem"
                          color="#7895B2"
                          fontSize="0.9375rem"
                          fontWeight={400}
                          lineHeight="1.5rem"
                        >
                          {localeText(LANGUAGES.ADDRESS)}
                        </Text>
                        <Text
                          w={'21.25rem'}
                          color="#556A7E"
                          fontSize="0.9375rem"
                          fontWeight={500}
                          lineHeight="1.5rem"
                        >
                          {`${ordersInfo.state} ${ordersInfo.city} ${
                            ordersInfo.addressLineOne ||
                            ordersInfo.roadNameMainAddr
                          } ${ordersInfo.addressLineTwo || ordersInfo.subAddr} ${ordersInfo.zipCode}`}
                        </Text>
                      </HStack>
                      <HStack
                        w="100%"
                        spacing="2rem"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Text
                          w="10rem"
                          color="#7895B2"
                          fontSize="0.9375rem"
                          fontWeight={400}
                          lineHeight="1.5rem"
                        >
                          {localeText(LANGUAGES.ORDER.MESSAGES)}
                        </Text>
                        <Text
                          w={'21.25rem'}
                          color="#556A7E"
                          fontSize="0.9375rem"
                          fontWeight={500}
                          lineHeight="1.5rem"
                        >
                          {ordersInfo.ordersMemo}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'} alignItems="flex-start">
              <HStack
                w="100%"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  color="#485766"
                  fontSize="1.125rem"
                  fontWeight={500}
                  lineHeight="1.96875rem"
                >
                  {localeText(LANGUAGES.SALES.NOTES)}
                </Text>
                <Button
                  w={'7rem'}
                  h={'3rem'}
                  p={'0.625rem 1.25rem'}
                  bg={'#7895B2'}
                  borderRadius={'0.25rem'}
                  onClick={() => {
                    handlePatchProduct();
                  }}
                >
                  <Text
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                    color={'#FFF'}
                  >
                    {localeText(LANGUAGES.COMMON.SAVE)}
                  </Text>
                </Button>
              </HStack>
              <Box w={'100%'} h={'7.75rem'}>
                <Textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                  p={'0.875rem'}
                  w={'100%'}
                  h={'100%'}
                  resize={'none'}
                  placeholder={localeText(LANGUAGES.SALES.PH_ENTER_NOTE)}
                  borderRadius={'0.25rem'}
                  border={'1px solid #9CADBE'}
                />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default SalesDetailPage;
