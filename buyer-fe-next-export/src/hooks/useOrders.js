'use clinet';

import { Box, Button, Text, useEditable, VStack } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import useLocale from './useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  modalOrderCancelState,
  modalOrderDetailState,
  modalOrderInquiriesState,
  modalOrderReturnState,
  modalOrderReviewsState,
  modalOrderTrackState,
} from '@/stores/modalRecoil';
import { SUCCESS } from '@/constants/errorCode';
import {
  isOrderAddFlagState,
  selectedOrdersState,
  selectedOrderState,
  stripeBeforeOrdersDataState,
  stripeOrdersIdState,
} from '@/stores/orderRecoil';
import useDevice from './useDevice';
import ordersApi from '@/services/ordersApi';

import useModal from './useModal';
import { usePathname } from 'next/navigation';
import { MY_PAGE, SERVICE } from '@/constants/pageURL';

const useOrders = () => {
  const pathName = usePathname();
  const { isMobile } = useDevice();
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const [isOrderAddFlag, setIsOrderAddFlag] =
    useRecoilState(isOrderAddFlagState);

  const [isOpenDetail, setIsOpenDetail] = useRecoilState(modalOrderDetailState);
  const setIsOpenTrack = useSetRecoilState(modalOrderTrackState);
  const setIsOpenCancel = useSetRecoilState(modalOrderCancelState);
  const setIsOpenInquiries = useSetRecoilState(modalOrderInquiriesState);
  const setIsOpenReturn = useSetRecoilState(modalOrderReturnState);
  const setIsOpenReviews = useSetRecoilState(modalOrderReviewsState);

  const onOpenDetail = () => setIsOpenDetail(true);
  const onOpenTrack = () => setIsOpenTrack(true);
  const onOpenInquiries = () => setIsOpenInquiries(true);
  const onOpenCancel = () => setIsOpenCancel(true);
  const onOpenReturn = () => setIsOpenReturn(true);
  const onOpenReview = () => setIsOpenReviews(true);

  const onCloseDetail = () => setIsOpenDetail(false);
  const onCloseTrack = () => setIsOpenTrack(false);
  const onCloseInquiries = () => setIsOpenInquiries(false);
  const onCloseCancel = () => setIsOpenCancel(false);
  const onCloseReturn = () => setIsOpenReturn(false);
  const onCloseReviews = () => setIsOpenReviews(false);

  const [selectedOrder, setSelectedOrder] = useRecoilState(selectedOrderState);
  const [selectedOrders, setSelectedOrders] =
    useRecoilState(selectedOrdersState);
  const [stripeOrdersId, setStripeOrdersId] =
    useRecoilState(stripeOrdersIdState);
  const [stripeBeforeOrdersData, setStripeBeforeOrdersData] = useRecoilState(
    stripeBeforeOrdersDataState,
  );

  useEffect(() => {
    // list 에 포함되지 않는 pathname 이면 초기화
    const allowList = [SERVICE.BRAND.PRODUCT, SERVICE.ORDER.ROOT];
    const isProductDetail = pathName.startsWith('/service/product/');
    const isServiceBrand = pathName.startsWith('/service/brand/');
    const isOrderHistory = pathName.startsWith(MY_PAGE.ORDER_HISTORY);
    const isAllowedPath =
      isProductDetail ||
      isServiceBrand ||
      isOrderHistory ||
      allowList.includes(pathName);

    if (!isAllowedPath) {
      handleClearOrder();
    }
  }, [pathName]);

  const handleClearOrder = () => {
    setIsOrderAddFlag(false);
    setSelectedOrder({});
    setSelectedOrders({});
    setStripeOrdersId(null);
    setStripeBeforeOrdersData({});
  };

  const handleDetail = useCallback((orders) => {
    setSelectedOrders(orders);
    onOpenDetail();
  });

  const handleInquiries = useCallback((orders, product) => {
    setSelectedOrders(orders);
    setSelectedOrder(product);
    onOpenInquiries();
  });

  const handleTrack = useCallback((orders, product) => {
    // setSelectedOrders(orders);
    // setSelectedOrder(product);
    // onOpenTrack();
    window.open('https://asapx.ai', '_blank');
  });

  const handleCancel = useCallback((orders, product) => {
    setSelectedOrders(orders);
    setSelectedOrder(product);
    onOpenCancel();
  });

  const handleReturn = useCallback((orders, product) => {
    setSelectedOrders(orders);
    setSelectedOrder(product);
    onOpenReturn();
  });

  const handleReview = useCallback((orders, product) => {
    setSelectedOrders(orders);
    setSelectedOrder(product);
    onOpenReview();
  });

  //

  const handleActionInquiries = useCallback((orders, product) => {
    setSelectedOrders(orders);
    setSelectedOrder(product);
    onOpenInquiries();
  });

  const handleActionTrack = useCallback((orders, product) => {
    setSelectedOrders(orders);
    setSelectedOrder(product);
    onOpenTrack();
  });

  const handleActionCancel = useCallback(
    async (orders, cancelIndex, cancelReason, callBack) => {
      let tempReason = '';
      if (cancelIndex === 1) {
        tempReason = localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_MISTAKE);
      } else if (cancelIndex === 2) {
        tempReason = localeText(LANGUAGES.MY_PAGE.ORDER.DAMAGED_OR_DEFECTIVE);
      } else if (cancelIndex === 3) {
        tempReason = localeText(LANGUAGES.MY_PAGE.ORDER.WRONG_ITEM_DELIVERED);
      } else if (cancelIndex === 4) {
        tempReason = cancelReason;
      }
      const param = {
        ordersId: orders.ordersId,
        cancelReason: tempReason,
      };
      const result = await ordersApi.patchOrdersCancel(param);

      if (result?.errorCode === SUCCESS) {
        setTimeout(() => {
          openModal({
            text: result.message,
            onAgree: async () => {
              callBack(true);
            },
          });
        }, 200);
      }
    },
  );

  const handleActionReturn = useCallback(
    async (orders, returnIndex, returnReason, callBack) => {
      let tempReason = '';
      if (returnIndex === 1) {
        tempReason = localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_MISTAKE);
        if (returnReason) {
          tempReason += ' > ' + returnReason;
        }
      } else if (returnIndex === 2) {
        tempReason = localeText(LANGUAGES.MY_PAGE.ORDER.DAMAGED_OR_DEFECTIVE);
        tempReason += ' > ' + returnReason;
      } else if (returnIndex === 3) {
        tempReason = localeText(LANGUAGES.MY_PAGE.ORDER.WRONG_ITEM_DELIVERED);
        tempReason += ' > ' + returnReason;
      } else if (returnIndex === 4) {
        tempReason = returnReason;
      }
      const param = {
        ordersId: orders.ordersId,
        returnReason: tempReason,
      };
      const result = await ordersApi.patchOrdersReturn(param);

      if (result?.errorCode === SUCCESS) {
        setTimeout(() => {
          openModal({
            text: result.message,
            onAgree: async () => {
              callBack(true);
            },
          });
        }, 200);
      } else {
        setTimeout(() => {
          openModal({
            text: result.message,
          });
        }, 200);
      }
    },
  );

  const handleActionReview = useCallback((orders, product) => {
    setSelectedOrders(orders);
    setSelectedOrder(product);
    onOpenReview();
  });

  const handleDeliveryStatus = useCallback((deliveryStatus) => {
    if (Number(deliveryStatus) === 1) {
      return localeText(LANGUAGES.STATUS.SHIPPING_PREPARATION);
    } else if (Number(deliveryStatus) === 2) {
      return localeText(LANGUAGES.STATUS.SHIPPING);
    } else if (Number(deliveryStatus) === 3) {
      return localeText(LANGUAGES.STATUS.ORDER_COMPLETED);
    } else if (Number(deliveryStatus) === 4) {
      return localeText(LANGUAGES.STATUS.REQUEST_ORDER_CANCELLATION);
    } else if (Number(deliveryStatus) === 5) {
      return localeText(LANGUAGES.STATUS.ORDER_CANCELLATION_COMPLETED);
    } else if (Number(deliveryStatus) === 6) {
      return localeText(LANGUAGES.STATUS.RETURN_REQUEST);
    } else if (Number(deliveryStatus) === 7) {
      return localeText(LANGUAGES.STATUS.RETURN_COMPLETED);
    } else if (Number(deliveryStatus) === 8) {
      return localeText(LANGUAGES.STATUS.SHIPPED);
    }
  });

  const handleDeliveryBntByStatus = useCallback((orders, product) => {
    const status = orders.status;

    const bntInquiries = (orders, product) => {
      return (
        <Button
          onClick={() => {
            handleInquiries(orders, product);
          }}
          h={'100%'}
          w={'100%'}
          borderRadius={'0.25rem'}
          border={'1px solid #7895B2'}
        >
          <Text
            color={'#556A7E'}
            fontSize={'1rem'}
            fontWeight={400}
            lineHeight={'1.75rem'}
          >
            {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_INQUIRIES)}
          </Text>
        </Button>
      );
    };

    if (status === 1) {
      return isMobile(true) ? (
        <VStack w={'100%'} spacing={'0.5rem'}>
          <Box w={'100%'} h={'3rem'}>
            <Button
              onClick={() => {
                handleTrack(orders, product);
              }}
              h={'100%'}
              w={'100%'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
            >
              <Text
                color={'#FFF'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.TRACK_SHIPMENT)}
              </Text>
            </Button>
          </Box>
          <Box w={'100%'} h={'3rem'}>
            {bntInquiries(orders, product)}
          </Box>
          <Box w={'100%'} h={'3rem'}>
            <Button
              onClick={() => {
                handleCancel(orders, product);
              }}
              h={'100%'}
              w={'100%'}
              borderRadius={'0.25rem'}
              border={'1px solid #A87C4E'}
            >
              <Text
                color={'#A87C4E'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.CANCEL_ORDER)}
              </Text>
            </Button>
          </Box>
        </VStack>
      ) : (
        <VStack spacing={'0.5rem'}>
          <Box minW={'7rem'} w={'11.1875rem'} h={'3rem'}>
            <Button
              onClick={() => {
                handleTrack(orders, product);
              }}
              h={'100%'}
              w={'100%'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
            >
              <Text
                color={'#FFF'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.TRACK_SHIPMENT)}
              </Text>
            </Button>
          </Box>
          <Box minW={'7rem'} w={'11.1875rem'} h={'3rem'}>
            {bntInquiries(orders, product)}
          </Box>
          <Box minW={'7rem'} w={'11.1875rem'} h={'3rem'}>
            <Button
              onClick={() => {
                handleCancel(orders, product);
              }}
              h={'100%'}
              w={'100%'}
              borderRadius={'0.25rem'}
              border={'1px solid #A87C4E'}
            >
              <Text
                color={'#A87C4E'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.CANCEL_ORDER)}
              </Text>
            </Button>
          </Box>
        </VStack>
      );
    } else {
      return isMobile(true) ? (
        <VStack w={'100%'} spacing={'0.5rem'}>
          <Box w={'100%'} h={'3rem'}>
            <Button
              onClick={() => {
                if (orders.status !== 6) {
                  openModal({
                    text: localeText(
                      LANGUAGES.MY_PAGE.ORDER.RETURNING_PRODUCT_ERROR,
                    ),
                  });
                  return;
                }
                handleReturn(orders, product);
              }}
              h={'100%'}
              w={'100%'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
            >
              <Text
                color={'#FFF'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.RETURNING_PRODUCT)}
              </Text>
            </Button>
          </Box>
          <Box w={'100%'} h={'3rem'}>
            {bntInquiries(orders, product)}
          </Box>
          <Box w={'100%'} h={'3rem'}>
            <Button
              onClick={() => {
                handleReview(orders, product);
              }}
              h={'100%'}
              w={'100%'}
              borderRadius={'0.25rem'}
              border={'1px solid #A87C4E'}
            >
              <Text
                color={'#A87C4E'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.REGISTER_REVIEW)}
              </Text>
            </Button>
          </Box>
        </VStack>
      ) : (
        <VStack spacing={'0.5rem'}>
          {status === 3 && (
            <Box minW={'7rem'} w={'11.1875rem'} h={'3rem'}>
              <Button
                onClick={() => {
                  if (orders.status !== 6) {
                    openModal({
                      text: localeText(
                        LANGUAGES.MY_PAGE.ORDER.RETURNING_PRODUCT_ERROR,
                      ),
                    });
                    return;
                  }
                  handleReturn(orders, product);
                }}
                h={'100%'}
                w={'100%'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.RETURNING_PRODUCT)}
                </Text>
              </Button>
            </Box>
          )}
          <Box minW={'7rem'} w={'11.1875rem'} h={'3rem'}>
            {bntInquiries(orders, product)}
          </Box>
          {status === 3 && (
            <Box minW={'7rem'} w={'11.1875rem'} h={'3rem'}>
              <Button
                onClick={() => {
                  handleReview(orders, product);
                }}
                h={'100%'}
                w={'100%'}
                borderRadius={'0.25rem'}
                border={'1px solid #A87C4E'}
              >
                <Text
                  color={'#A87C4E'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.REGISTER_REVIEW)}
                </Text>
              </Button>
            </Box>
          )}
        </VStack>
      );
    }
  });

  return {
    // 주문진행상태
    isOrderAddFlag,
    setIsOrderAddFlag,
    handleClearOrder,
    //
    selectedOrder,
    setSelectedOrder,
    selectedOrders,
    setSelectedOrders,
    //
    handleDeliveryStatus,
    handleDeliveryBntByStatus,
    //
    handleDetail,
    handleReturn,
    handleReview,
    handleCancel,
    handleInquiries,
    handleTrack,
    //
    handleActionInquiries,
    handleActionTrack,
    handleActionCancel,
    handleActionReturn,
    handleActionReview,
    //
    isOpenDetail,
    setIsOpenDetail,
    setIsOpenTrack,
    setIsOpenCancel,
    setIsOpenInquiries,
    setIsOpenReviews,
    setIsOpenReturn,
    //
    onOpenDetail,
    onOpenTrack,
    onOpenInquiries,
    onOpenCancel,
    onOpenReturn,
    onOpenReview,
  };
};

export default useOrders;
