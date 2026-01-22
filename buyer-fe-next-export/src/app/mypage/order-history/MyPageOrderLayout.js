'use client';

import { Box } from '@chakra-ui/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  modalOrderCancelState,
  modalOrderDetailState,
  modalOrderInquiriesState,
  modalOrderReturnState,
  modalOrderReviewsState,
  modalOrderTrackState,
} from '@/stores/modalRecoil';
import OrderDetailModal from '@/components/alert/custom/order/OrderDetailModal';
import OrderTrackModal from '@/components/alert/custom/order/OrderTrackModal';
import OrderCancelModal from '@/components/alert/custom/order/OrderCancelModal';
import OrderInquiriesModal from '@/components/alert/custom/order/OrderInquiriesModal';
import OrderReturnModal from '@/components/alert/custom/order/OrderReturnModal';
import OrderReviewsModal from '@/components/alert/custom/order/OrderReviewModal';
import { initOrdersState } from '@/stores/orderRecoil';

const MyPageOrderLayout = ({ children }) => {
  const setIsInitOrders = useSetRecoilState(initOrdersState);
  const [isOpenDetail, setIsOpenDetail] = useRecoilState(modalOrderDetailState);
  const [isOpenTrack, setIsOpenTrack] = useRecoilState(modalOrderTrackState);
  const [isOpenCancel, setIsOpenCancel] = useRecoilState(modalOrderCancelState);
  const [isOpenInquiries, setIsOpenInquiries] = useRecoilState(
    modalOrderInquiriesState,
  );
  const [isOpenReturn, setIsOpenReturn] = useRecoilState(modalOrderReturnState);
  const [isOpenReviews, setIsOpenReviews] = useRecoilState(
    modalOrderReviewsState,
  );

  const onCloseDetail = () => setIsOpenDetail(false);
  const onCloseTrack = () => setIsOpenTrack(false);
  const onCloseCancel = () => setIsOpenCancel(false);
  const onCloseInquiries = () => setIsOpenInquiries(false);
  const onCloseReturn = () => setIsOpenReturn(false);
  const onCloseReviews = () => setIsOpenReviews(false);

  return (
    <Box w={'100%'}>
      {children}
      {isOpenDetail && (
        <OrderDetailModal isOpen={isOpenDetail} onClose={onCloseDetail} />
      )}
      {!isOpenDetail && isOpenTrack && (
        <OrderTrackModal isOpen={isOpenTrack} onClose={onCloseTrack} />
      )}
      {!isOpenDetail && isOpenCancel && (
        <OrderCancelModal
          isOpen={isOpenCancel}
          onClose={(ret) => {
            if (ret) {
              setIsInitOrders(true);
            }
            onCloseCancel();
          }}
        />
      )}
      {!isOpenDetail && isOpenInquiries && (
        <OrderInquiriesModal
          isOpen={isOpenInquiries}
          onClose={onCloseInquiries}
        />
      )}
      {!isOpenDetail && isOpenReturn && (
        <OrderReturnModal
          isOpen={isOpenReturn}
          onClose={(ret) => {
            if (ret) {
              setIsInitOrders(true);
            }
            onCloseReturn();
          }}
        />
      )}
      {!isOpenDetail && isOpenReviews && (
        <OrderReviewsModal
          isOpen={isOpenReviews}
          onClose={() => {
            onCloseReviews();
          }}
        />
      )}
    </Box>
  );
};

export default MyPageOrderLayout;
