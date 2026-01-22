'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import useLocale from './useLocale';
import useOrders from './useOrders';
import useMove from './useMove';
import useModal from './useModal';
import ordersApi from '@/services/ordersApi';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);
let externalSetState = null;

/** Stripe 상태 관리 훅 */
export function useStripePayment() {
  const [clientSecret, setClientSecret] = useState('');
  const [isOpenStripe, setIsOpenStripe] = useState(false);

  useEffect(() => {
    externalSetState = { setClientSecret, setIsOpenStripe };
  }, []);

  const StripeElementsWrapper = ({ children }) => {
    if (!clientSecret) return null;
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        {children}
      </Elements>
    );
  };

  return { clientSecret, isOpenStripe, setIsOpenStripe, StripeElementsWrapper };
}

/** 외부에서 Stripe 모달 열기 */
export async function openStripeModal({ clientSecret }) {
  if (!externalSetState) {
    console.warn('StripePayment 훅이 초기화되지 않았습니다.');
    return;
  }
  externalSetState.setClientSecret(clientSecret);
  externalSetState.setIsOpenStripe(true);
}

function CheckoutForm({ onClose, orderDataStripe, closeStripeModal }) {
  const { localeText } = useLocale();
  const { handleClearOrder } = useOrders();
  const { moveOrdersHistory } = useMove();
  const { openModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const successOrders = () => {
    handleClearOrder();
    moveOrdersHistory();
  };

  /** 결제 결과 polling */
  const startPolling = async (ordersId) => {
    let retries = 0;
    const maxRetries = 3;

    const interval = setInterval(async () => {
      const result = await ordersApi.getOrders({ ordersId });
      if (result?.errorCode === SUCCESS && result.data?.payStatus === 2) {
        clearInterval(interval);
        closeStripeModal();
        openModal({
          text: '결제가 성공적으로 완료되었습니다!',
          onAgree: successOrders,
        });
        return;
      }

      retries++;
      if (retries >= maxRetries) {
        clearInterval(interval);
        closeStripeModal();
        alert('결제 상태를 확인할 수 없습니다. 관리자에게 문의하세요.');
      }
    }, 3000);
  };

  /** 결제 요청 */
  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: 'if_required',
    });

    setIsProcessing(false);

    if (result.error) {
      openModal({
        text: `${localeText(LANGUAGES.INFO_MSG.PAYMENT_PROCESSING_ERROR)}\n${result.error.message}`,
      });
      return;
    }

    const paymentIntent = result.paymentIntent;

    if (paymentIntent?.status === 'succeeded') {
      if (orderDataStripe?.ordersId) {
        startPolling(orderDataStripe.ordersId);
      } else {
        closeStripeModal();
        openModal({
          text: localeText(
            LANGUAGES.INFO_MSG.PAYMENT_STRIPE_NOT_FOUND_ORDER_ID_ERROR,
          ),
        });
      }
    } else if (paymentIntent?.status === 'processing') {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.PAYMENT_STRIPE_PROCESSING_ERROR),
      });
    }
  };

  if (!stripe || !elements) return <p>결제 준비 중...</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      style={{ position: 'relative' }}
    >
      <PaymentElement />
      <Button mt={4} colorScheme="blue" type="submit">
        결제 진행
      </Button>
      {isProcessing && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(255, 255, 255, 0.7)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={10}
          borderRadius="md"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
    </form>
  );
}

export function StripeModal({ orderDataStripe }) {
  const { clientSecret, isOpenStripe, setIsOpenStripe, StripeElementsWrapper } =
    useStripePayment();

  const handleClose = () => setIsOpenStripe(false);

  if (!clientSecret) return null;

  return (
    <StripeElementsWrapper>
      <Modal
        isOpen={isOpenStripe}
        onClose={handleClose}
        size="lg"
        isCentered
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>결제</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CheckoutForm
              onClose={handleClose}
              orderDataStripe={orderDataStripe}
              closeStripeModal={handleClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </StripeElementsWrapper>
  );
}
