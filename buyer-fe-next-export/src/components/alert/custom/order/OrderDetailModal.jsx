'use client';

import { CustomIcon } from '@/components';
import {
  Box,
  VStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Center,
  Img,
  Divider,
  Button,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';
import utils from '@/utils';
import useOrders from '@/hooks/useOrders';
import OrderReviewsModal from './OrderReviewModal';
import OrderReturnModal from './OrderReturnModal';
import OrderInquiriesModal from './OrderInquiriesModal';
import OrderCancelModal from './OrderCancelModal';
import OrderTrackModal from './OrderTrackModal';
import {
  modalOrderCancelState,
  modalOrderDetailState,
  modalOrderInquiriesState,
  modalOrderReturnState,
  modalOrderReviewsState,
  modalOrderTrackState,
} from '@/stores/modalRecoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import ordersApi from '@/services/ordersApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import buyerApi from '@/services/buyerUserApi';
import useDevice from '@/hooks/useDevice';
import OrderCard from '@/components/custom/order/OrderCard';

const OrderDetailModal = (props) => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const isOpenDetail = useRecoilValue(modalOrderDetailState);
  const [isOpenTrack, setIsOpenTrack] = useRecoilState(modalOrderTrackState);
  const [isOpenCancel, setIsOpenCancel] = useRecoilState(modalOrderCancelState);
  const [isOpenInquiries, setIsOpenInquiries] = useRecoilState(
    modalOrderInquiriesState,
  );
  const [isOpenReturn, setIsOpenReturn] = useRecoilState(modalOrderReturnState);
  const [isOpenReviews, setIsOpenReviews] = useRecoilState(
    modalOrderReviewsState,
  );

  const onCloseTrack = () => setIsOpenTrack(false);
  const onCloseCancel = () => setIsOpenCancel(false);
  const onCloseInquiries = () => setIsOpenInquiries(false);
  const onCloseReturn = () => setIsOpenReturn(false);
  const onCloseReviews = () => setIsOpenReviews(false);

  const { lang, localeText } = useLocale();
  const [userInfo, setUserInfo] = useState({});
  const [detailOrders, setDetailOrders] = useState({});
  const [detailAddress, setDetailAddress] = useState({});
  const [ordersProducts, setOrdersProducts] = useState([]);

  const { selectedOrders, handleDeliveryStatus, handleDeliveryBntByStatus } =
    useOrders();

  const { isOpen, onClose } = props;

  useEffect(() => {
    handleGetMyInfo();
    if (selectedOrders) {
      handleGetOrders();
    }
  }, [selectedOrders]);

  const handleGetMyInfo = useCallback(async () => {
    const result = await buyerApi.getBuyerMyInfo();
    if (result?.errorCode === SUCCESS) {
      setUserInfo(result.data);
    }
  });

  const handleGetOrders = async () => {
    if (!selectedOrders?.ordersId) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED),
        onAgree: () => {
          handleFinally();
        },
      });
    }

    const param = {
      ordersId: selectedOrders?.ordersId,
    };
    const result = await ordersApi.getOrders(param);
    if (result?.errorCode === SUCCESS) {
      const data = result.data;
      setDetailOrders(data);
      setDetailAddress(data.ordersAddress);
      setOrdersProducts(data?.ordersProducts || []);
    } else {
      openModal({
        text: result.message,
        onAgree: () => {
          handleFinally();
        },
      });
    }
  };

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleParseAddress = () => {
    let addr = null;
    if (detailAddress.addressType === 1) {
      addr = detailAddress.roadNameMainAddr;
      if (detailAddress?.subAddr) {
        addr += ' ' + detailAddress.subAddr;
      }
    } else {
      addr = detailAddress.addressLineOne;
      if (detailAddress?.addressLineTwo) {
        addr += ' ' + detailAddress.addressLineTwo;
      }
    }
    return addr;
  };

  const handleGetPayStatus = (payStatus) => {
    // 1:결제대기, 2:결제완료, 3:환불요청, 4:환불완료
    if (payStatus === 1) {
      return localeText(LANGUAGES.STATUS.UNPAID);
    } else if (payStatus === 2) {
      return localeText(LANGUAGES.STATUS.PAID);
    } else if (payStatus === 3) {
      return localeText(LANGUAGES.STATUS.REFUND_REQUESTED);
    } else if (payStatus === 4) {
      return localeText(LANGUAGES.STATUS.REFUNDED);
    }
  };

  const orderCardRow = useCallback(() => {
    const status = selectedOrders?.status;
    const orderNum = selectedOrders?.orderNum;
    const actualAmount = selectedOrders?.actualAmount;
    const totalAmount = selectedOrders?.totalAmount;
    const discountAmount = selectedOrders?.discountAmount;
    const ordersId = selectedOrders?.ordersId;
    const createdAt = selectedOrders?.createdAt;
    const payStatus = selectedOrders?.payStatus;

    const ordersProducts = selectedOrders?.ordersProducts || [];

    let name = '';
    let count = '';
    let brandName = '';
    let productId = '';
    let ordersProductId = '';
    let unitPrice = '';
    let totalPrice = '';
    let ordersProductOptionList = '';
    let deliveryStatus = '';
    let productImageList = '';

    if (ordersProducts.length > 0) {
      const ordersProduct = ordersProducts[0];
      name = ordersProduct?.name;
      count = ordersProduct?.count;
      brandName = ordersProduct?.brandName;
      productId = ordersProduct?.productId;
      ordersProductId = ordersProduct?.ordersProductId;
      unitPrice = ordersProduct?.unitPrice;
      totalPrice = ordersProduct?.totalPrice;
      deliveryStatus = ordersProduct?.deliveryStatus;
      ordersProductOptionList = ordersProduct?.ordersProductOptionList || [];
      productImageList = ordersProduct?.productImageList || [];
    }

    return isMobile(true) ? (
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
            const name = target.name;
            const ordersProductId = target.ordersProductId;
            const ordersProductOptionList =
              target.ordersProductOptionList || [];
            const productId = target.productId;
            const productImageList = target?.productImageList || [];
            const totalPrice = target.totalPrice;
            const unitPrice = target.unitPrice;

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
                              {`${utils.parseDallar(totalPrice)} / ${count}${localeText(LANGUAGES.ORDER.EA)}`}
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
                        {handleDeliveryBntByStatus(selectedOrders, target)}
                      </Center>
                    </VStack>
                  </Box>
                </VStack>

                <ContentBR h={'1.25rem'} />

                <Box w={'100%'} bg={'#8C644212'} px={'1rem'} py={'0.75rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Text
                        fontSize={'1rem'}
                        fontWeight={400}
                        color={'#556A7E'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_PRICE)}
                      </Text>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={500}
                      >
                        {utils.parseDallar(totalAmount)}
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Box>
    ) : (
      <Box w={'100%'}>
        <VStack spacing={'1rem'}>
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
            const ordersProductOptionList =
              target.ordersProductOptionList || [];
            const productId = target.productId;
            const productImageList = target?.productImageList || [];
            const totalPrice = target.totalPrice;
            const unitPrice = target.unitPrice;
            return (
              <Box key={index} w={'100%'} overflowX={'auto'}>
                <HStack justifyContent={'space-between'}>
                  <Box width={'100%'}>
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
                              {`${utils.parseDallar(totalPrice)} / ${count}${localeText(LANGUAGES.ORDER.EA)}`}
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
                              {localeText(LANGUAGES.ORDER.TOTAL_ORDER_PRICE)}
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
                              {localeText(LANGUAGES.ORDER.FINAL_ORDER_PRICE)}
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
                            {handleDeliveryBntByStatus(selectedOrders, target)}
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
    );
  });

  return isMobile(true) ? (
    <Modal
      isOpen={isOpen}
      onClose={handleFinally}
      size={'full'}
      scrollBehavior="inside"
    >
      <ModalOverlay bg={'#00000099'} />
      <ModalContent alignSelf={'center'} borderRadius={0} w={'100%'} h={'100%'}>
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          py={0}
          pt={'1.5rem'}
          px={clampW(1, 5)}
        >
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DETAILS)}
                </Text>
              </Box>
              <Box
                w={'2rem'}
                h={'2rem'}
                cursor={'pointer'}
                onClick={() => {
                  handleFinally();
                }}
              >
                <CustomIcon
                  w={'100%'}
                  h={'100%'}
                  name={'close'}
                  color={'#7895B2'}
                />
              </Box>
            </HStack>
          </Box>

          <ContentBR h={'1rem'} />

          <Box
            w={'100%'}
            py={'1.25rem'}
            borderTop={'1px solid #576076'}
            borderBottom={'1px solid #AEBDCA'}
          >
            <VStack spacing={'0.75rem'} alignItems={'flex-start'}>
              <Box>
                <Box
                  px={'1rem'}
                  py={'0.5rem'}
                  bg={'#E8DFCA'}
                  borderRadius={'1.25rem'}
                >
                  <Text
                    color={'#A87C4E'}
                    fontSize={'0.9375rem'}
                    fontWeight={500}
                    lineHeight={'1.5rem'}
                    textAlign={'center'}
                  >
                    {handleGetPayStatus(detailOrders.payStatus)}
                  </Text>
                </Box>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.25rem'}>
                  <Box w={'100%'}>
                    <HStack spacing={'1.25rem'}>
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
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {utils.parseDateByCountryCode(
                            detailOrders?.createdAt,
                            lang,
                            true,
                          ) || ''}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  <Box w={'100%'}>
                    <HStack spacing={'1.25rem'}>
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
                          {detailOrders?.orderNum || ''}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.25rem'} />

          <Box w={'100%'}>
            <Text
              color={'#485766'}
              fontSize={'1.25rem'}
              fontWeight={500}
              lineHeight={'2.25rem'}
            >
              {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_INFO)}
            </Text>
          </Box>

          <ContentBR h={'1.25rem'} />

          <Box w={'100%'}>
            <VStack spacing={0}>{orderCardRow()}</VStack>
          </Box>

          <ContentBR h={'1.5rem'} />

          {/* 배송추적 */}
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(1.25, 1.5)}
                  fontWeight={500}
                  lineHeight={'180%'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.TRACK_SHIPMENT)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={400}
                          lineHeight={'160%'}
                        >
                          {localeText(LANGUAGES.ACC.NAME)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={500}
                          lineHeight={'160%'}
                        >
                          {userInfo.name}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Box w={'10rem'}>
                        <Text
                          w={'10rem'}
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={400}
                          lineHeight={'160%'}
                        >
                          {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={500}
                          lineHeight={'160%'}
                        >
                          {utils.parsePhoneNum(userInfo.phone)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Box w={'10rem'}>
                        <Text
                          w={'10rem'}
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={400}
                          lineHeight={'160%'}
                        >
                          {localeText(LANGUAGES.ADDRESS.ADDRESS)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={500}
                          lineHeight={'160%'}
                        >
                          {handleParseAddress()}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  {detailAddress?.message && (
                    <Box w={'100%'}>
                      <HStack spacing={'2rem'}>
                        <Box w={'10rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={clampW(0.875, 1)}
                            fontWeight={400}
                            lineHeight={'160%'}
                          >
                            {localeText(LANGUAGES.MY_PAGE.ORDER.MESSAGES)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={clampW(0.875, 1)}
                            fontWeight={500}
                            lineHeight={'160%'}
                          >
                            {detailAddress.message}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.5rem'} />

          {/* 배송정보 */}
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(1.25, 1.5)}
                  fontWeight={500}
                  lineHeight={'180%'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.SHIPPING_INFO)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={400}
                          lineHeight={'160%'}
                        >
                          {localeText(LANGUAGES.ACC.NAME)}
                        </Text>
                      </Box>

                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={500}
                          lineHeight={'160%'}
                        >
                          {userInfo.name}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Text
                        w={'10rem'}
                        color={'#7895B2'}
                        fontSize={clampW(0.875, 1)}
                        fontWeight={400}
                        lineHeight={'160%'}
                      >
                        {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                      </Text>
                      <Text
                        color={'#556A7E'}
                        fontSize={clampW(0.875, 1)}
                        fontWeight={500}
                        lineHeight={'160%'}
                      >
                        {utils.parsePhoneNum(userInfo.phone)}
                      </Text>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Box w={'10rem'} minW={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={400}
                          lineHeight={'160%'}
                        >
                          {localeText(LANGUAGES.ADDRESS.ADDRESS)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={500}
                          lineHeight={'160%'}
                        >
                          {handleParseAddress()}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  {detailAddress?.message && (
                    <Box w={'100%'}>
                      <HStack spacing={'2rem'}>
                        <Text
                          w={'10rem'}
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={400}
                          lineHeight={'160%'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.MESSAGES)}
                        </Text>
                        <Text
                          color={'#556A7E'}
                          fontSize={clampW(0.875, 1)}
                          fontWeight={500}
                          lineHeight={'160%'}
                        >
                          {detailAddress.message}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.5rem'} />

          {/* 결제정보 */}
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(1.25, 1.5)}
                  fontWeight={500}
                  lineHeight={'2.475rem'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.PAYMENT_INFO)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.875, 1)}
                    fontWeight={400}
                    lineHeight={'160%'}
                  >
                    {localeText(LANGUAGES.ORDER.COUPON_DISCOUNT)}
                  </Text>
                  <Text
                    color={'#940808'}
                    fontSize={clampW(0.875, 1)}
                    fontWeight={500}
                    lineHeight={'160%'}
                  >
                    {`-${utils.parseDallar(detailOrders.couponDiscountAmount || 0)}`}
                  </Text>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.875, 1)}
                    fontWeight={400}
                    lineHeight={'160%'}
                  >
                    {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                  </Text>
                  <Text
                    color={'#556A7E'}
                    fontSize={clampW(0.875, 1)}
                    fontWeight={500}
                    lineHeight={'160%'}
                  >
                    {utils.parseDallar(detailOrders?.totalAmount || 0)}
                  </Text>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.875, 1)}
                    fontWeight={400}
                    lineHeight={'160%'}
                  >
                    {localeText(LANGUAGES.ORDER.REDEEMING_MILES)}
                  </Text>
                  <Text
                    color={'#556A7E'}
                    fontSize={clampW(0.875, 1)}
                    fontWeight={500}
                    lineHeight={'160%'}
                  >
                    {`${detailOrders?.rewardDiscountAmount || 0} coin`}
                  </Text>
                </HStack>
              </Box>

              <Divider borderBottom={'1px solid #AEBDCA'} />

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.ORDER.ORDER_TOTAL)}
                  </Text>

                  <Text
                    color={'#556A7E'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {utils.parseDallar(detailOrders.totalAmount || 0)}
                  </Text>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.ORDER.DISCOUNT)}
                  </Text>
                  <Text
                    color={'#940808'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {`-${utils.parseDallar(detailOrders.discountAmount)}`}
                  </Text>
                </HStack>
              </Box>

              <Divider borderBottom={'1px solid #AEBDCA'} />

              <Box w={'100%'}>
                <HStack spacing={'2rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.9375, 1)}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {`${localeText(LANGUAGES.ORDER.FINAL_PAYMENT_AMOUNT)} (${localeText(LANGUAGES.COMMON.CARD)})`}
                    </Text>
                  </Box>

                  <Text
                    color={'#556A7E'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {utils.parseDallar(detailOrders.actualAmount)}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.5rem'} />

          {isOpenDetail && isOpenTrack && (
            <OrderTrackModal isOpen={isOpenTrack} onClose={onCloseTrack} />
          )}
          {isOpenDetail && isOpenCancel && (
            <OrderCancelModal
              isOpen={isOpenCancel}
              onClose={(ret) => {
                if (ret) {
                  handleGetOrders();
                }
                onCloseCancel();
              }}
            />
          )}
          {isOpenDetail && isOpenInquiries && (
            <OrderInquiriesModal
              isOpen={isOpenInquiries}
              onClose={onCloseInquiries}
            />
          )}
          {isOpenDetail && isOpenReturn && (
            <OrderReturnModal
              isOpen={isOpenReturn}
              onClose={(ret) => {
                if (ret) {
                  handleGetOrders();
                }
                onCloseReturn();
              }}
            />
          )}
          {isOpenDetail && isOpenReviews && (
            <OrderReviewsModal
              isOpen={isOpenReviews}
              onClose={onCloseReviews}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'#00000099'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        // w={'60rem'}
        w={'64rem'}
        h={'100%'}
        maxH={'80%'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          pb={0}
          px={0}
        >
          <Box w={'100%'} h={'100%'}>
            <VStack spacing={'1.5rem'} px={'2.5rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DETAILS)}
                    </Text>
                  </Box>
                  <Box
                    w={'2rem'}
                    h={'2rem'}
                    cursor={'pointer'}
                    onClick={() => {
                      handleFinally();
                    }}
                  >
                    <CustomIcon
                      w={'100%'}
                      h={'100%'}
                      name={'close'}
                      color={'#7895B2'}
                    />
                  </Box>
                </HStack>
              </Box>

              {/* 상태 바 8.625rem */}
              <Box
                w={'100%'}
                py={'1.25rem'}
                borderTop={'1px solid #576076'}
                borderBottom={'1px solid #AEBDCA'}
              >
                <HStack justifyContent={'space-between'}>
                  <Box w={'100%'}>
                    <HStack
                      spacing={'1.25rem'}
                      justifyContent={'space-between'}
                    >
                      <Box
                        px={'1rem'}
                        py={'0.5rem'}
                        h={'2.5rem'}
                        bg={'#E8DFCA'}
                        borderRadius={'1.25rem'}
                      >
                        <Text
                          color={'#A87C4E'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                          textAlign={'center'}
                        >
                          {handleGetPayStatus(selectedOrders.payStatus)}
                        </Text>
                      </Box>

                      <Box>
                        <HStack>
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
                          <Box>
                            <Text
                              color={'#485766'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {utils.parseDateByCountryCode(
                                detailOrders?.createdAt,
                                lang,
                                true,
                              )}
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
                              {detailOrders?.orderNum}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>

            <Box
              w={'100%'}
              h={'calc(100% - 8.625rem)'}
              overflowY={'auto'}
              className={'no-scroll'}
            >
              <VStack spacing={0} px={'2.5rem'}>
                <ContentBR h={'2.5rem'} />

                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.25rem'}
                    fontWeight={500}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_INFO)}
                  </Text>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={0}>
                    <ContentBR h={'2.5rem'} />
                    {orderCardRow()}
                  </VStack>
                </Box>

                {/* 배송추적 */}
                <Box w={'100%'} mb={'2.5rem'}>
                  <ContentBR h={'3.75rem'} />
                  <VStack spacing={'3.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'2rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'2.475rem'}
                          >
                            {localeText(LANGUAGES.MY_PAGE.ORDER.TRACK_SHIPMENT)}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <VStack spacing={'1.25rem'}>
                            <Box w={'100%'}>
                              <HStack spacing={'2rem'}>
                                <Text
                                  w={'10rem'}
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ACC.NAME)}
                                </Text>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {userInfo.name}
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack spacing={'2rem'}>
                                <Text
                                  w={'10rem'}
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                                </Text>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {utils.parsePhoneNum(userInfo.phone)}
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack spacing={'2rem'}>
                                <Text
                                  w={'10rem'}
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ADDRESS.ADDRESS)}
                                </Text>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {handleParseAddress()}
                                </Text>
                              </HStack>
                            </Box>
                            {detailAddress?.message && (
                              <Box w={'100%'}>
                                <HStack spacing={'2rem'}>
                                  <Text
                                    w={'10rem'}
                                    color={'#7895B2'}
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.MY_PAGE.ORDER.MESSAGES,
                                    )}
                                  </Text>
                                  <Text
                                    color={'#556A7E'}
                                    fontSize={'1rem'}
                                    fontWeight={500}
                                    lineHeight={'1.75rem'}
                                  >
                                    {detailAddress.message}
                                  </Text>
                                </HStack>
                              </Box>
                            )}
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>

                    {/* 배송정보 */}
                    <Box w={'100%'}>
                      <VStack spacing={'2rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'2.475rem'}
                          >
                            {localeText(LANGUAGES.MY_PAGE.ORDER.SHIPPING_INFO)}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <VStack spacing={'1.25rem'}>
                            <Box w={'100%'}>
                              <HStack spacing={'2rem'}>
                                <Text
                                  w={'10rem'}
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ACC.NAME)}
                                </Text>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {userInfo.name}
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack spacing={'2rem'}>
                                <Text
                                  w={'10rem'}
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                                </Text>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {utils.parsePhoneNum(userInfo.phone)}
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack spacing={'2rem'}>
                                <Text
                                  w={'10rem'}
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ADDRESS.ADDRESS)}
                                </Text>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {handleParseAddress()}
                                </Text>
                              </HStack>
                            </Box>
                            {detailAddress?.message && (
                              <Box w={'100%'}>
                                <HStack spacing={'2rem'}>
                                  <Text
                                    w={'10rem'}
                                    color={'#7895B2'}
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.MY_PAGE.ORDER.MESSAGES,
                                    )}
                                  </Text>
                                  <Text
                                    color={'#556A7E'}
                                    fontSize={'1rem'}
                                    fontWeight={500}
                                    lineHeight={'1.75rem'}
                                  >
                                    {detailAddress.message}
                                  </Text>
                                </HStack>
                              </Box>
                            )}
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>

                    {/* 결제정보 */}
                    <Box w={'100%'}>
                      <VStack spacing={'1.5rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'2.475rem'}
                          >
                            {localeText(LANGUAGES.MY_PAGE.ORDER.PAYMENT_INFO)}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <VStack spacing={'1.25rem'}>
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'space-between'}
                                spacing={'1.25rem'}
                              >
                                <Box w={'49%'}>
                                  <VStack spacing={'1.25rem'}>
                                    <Box w={'100%'}>
                                      <HStack justifyContent={'space-between'}>
                                        <Text
                                          color={'#7895B2'}
                                          fontSize={'1rem'}
                                          fontWeight={400}
                                          lineHeight={'1.75rem'}
                                        >
                                          {localeText(
                                            LANGUAGES.ORDER.TOTAL_PRODUCT,
                                          )}
                                        </Text>
                                        <Text
                                          color={'#556A7E'}
                                          fontSize={'1rem'}
                                          fontWeight={500}
                                          lineHeight={'1.75rem'}
                                        >
                                          {utils.parseDallar(
                                            detailOrders.totalAmount,
                                          )}
                                        </Text>
                                      </HStack>
                                    </Box>
                                    {/*
                                    <Box w={'100%'}>
                                      <HStack justifyContent={'space-between'}>
                                        <Text
                                          color={'#7895B2'}
                                          fontSize={'1rem'}
                                          fontWeight={400}
                                          lineHeight={'1.75rem'}
                                        >
                                          {localeText(
                                            LANGUAGES.ORDER.TOTAL_SHIPPING,
                                          )}
                                        </Text>
                                        <Text
                                          color={'#556A7E'}
                                          fontSize={'1rem'}
                                          fontWeight={500}
                                          lineHeight={'1.75rem'}
                                        >
                                          $81.00
                                        </Text>
                                      </HStack>
                                    </Box>
                                    */}
                                  </VStack>
                                </Box>
                                <Box
                                  w={'1px'}
                                  h={'4.75rem'}
                                  borderRight={'1px solid #AEBDCA'}
                                />
                                <Box w={'49%'}>
                                  <VStack spacing={'1.25rem'}>
                                    <Box w={'100%'}>
                                      <HStack justifyContent={'space-between'}>
                                        <Text
                                          color={'#7895B2'}
                                          fontSize={'1rem'}
                                          fontWeight={400}
                                          lineHeight={'1.75rem'}
                                        >
                                          {localeText(
                                            LANGUAGES.ORDER.COUPON_DISCOUNT,
                                          )}
                                        </Text>
                                        <Text
                                          color={'#940808'}
                                          fontSize={'1rem'}
                                          fontWeight={500}
                                          lineHeight={'1.75rem'}
                                        >
                                          {`-${utils.parseDallar(detailOrders.couponDiscountAmount)}`}
                                        </Text>
                                      </HStack>
                                    </Box>
                                    <Box w={'100%'}>
                                      <HStack justifyContent={'space-between'}>
                                        <Text
                                          color={'#7895B2'}
                                          fontSize={'1rem'}
                                          fontWeight={400}
                                          lineHeight={'1.75rem'}
                                        >
                                          {localeText(
                                            LANGUAGES.ORDER.REDEEMING_MILES,
                                          )}
                                        </Text>
                                        <Text
                                          color={'#556A7E'}
                                          fontSize={'1rem'}
                                          fontWeight={500}
                                          lineHeight={'1.75rem'}
                                        >
                                          {`${detailOrders?.rewardDiscountAmount || 0} coin`}
                                        </Text>
                                      </HStack>
                                    </Box>
                                  </VStack>
                                </Box>
                              </HStack>
                            </Box>
                            <Divider borderBottom={'1px solid #AEBDCA'} />
                            <Box w={'100%'}>
                              <VStack spacing={'1.25rem'}>
                                <Box w={'100%'}>
                                  <HStack justifyContent={'space-between'}>
                                    <Text
                                      color={'#7895B2'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                    >
                                      {localeText(LANGUAGES.ORDER.ORDER_TOTAL)}
                                    </Text>

                                    <Text
                                      color={'#556A7E'}
                                      fontSize={'1rem'}
                                      fontWeight={500}
                                      lineHeight={'1.75rem'}
                                    >
                                      {utils.parseDallar(
                                        detailOrders.totalAmount,
                                      )}
                                    </Text>
                                  </HStack>
                                </Box>
                                <Box w={'100%'}>
                                  <HStack justifyContent={'space-between'}>
                                    <Text
                                      color={'#7895B2'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                    >
                                      {localeText(LANGUAGES.ORDER.DISCOUNT)}
                                    </Text>
                                    <Text
                                      color={'#940808'}
                                      fontSize={'1rem'}
                                      fontWeight={500}
                                      lineHeight={'1.75rem'}
                                    >
                                      {`-${utils.parseDallar(detailOrders.discountAmount)}`}
                                    </Text>
                                  </HStack>
                                </Box>
                              </VStack>
                            </Box>
                            <Divider borderBottom={'1px solid #AEBDCA'} />
                            <Box w={'100%'}>
                              <HStack justifyContent={'space-between'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {`${localeText(LANGUAGES.ORDER.FINAL_PAYMENT_AMOUNT)} (${localeText(LANGUAGES.COMMON.CARD)})`}
                                </Text>

                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {utils.parseDallar(detailOrders.actualAmount)}
                                </Text>
                              </HStack>
                            </Box>
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                  <ContentBR h={'2.5rem'} />
                </Box>
              </VStack>
            </Box>
          </Box>

          {isOpenDetail && isOpenTrack && (
            <OrderTrackModal isOpen={isOpenTrack} onClose={onCloseTrack} />
          )}
          {isOpenDetail && isOpenCancel && (
            <OrderCancelModal
              isOpen={isOpenCancel}
              onClose={(ret) => {
                if (ret) {
                  handleGetOrders();
                }
                onCloseCancel();
              }}
            />
          )}
          {isOpenDetail && isOpenInquiries && (
            <OrderInquiriesModal
              isOpen={isOpenInquiries}
              onClose={onCloseInquiries}
            />
          )}
          {isOpenDetail && isOpenReturn && (
            <OrderReturnModal
              isOpen={isOpenReturn}
              onClose={(ret) => {
                if (ret) {
                  handleGetOrders();
                }
                onCloseReturn();
              }}
            />
          )}
          {isOpenDetail && isOpenReviews && (
            <OrderReviewsModal
              isOpen={isOpenReviews}
              onClose={onCloseReviews}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailModal;
