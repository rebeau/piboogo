'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { SUCCESS } from '@/constants/errorCode';
import paymentTransactionApi from '@/services/paymentTransactionApi';
import useModal from '@/hooks/useModal';
import { nanoid } from 'nanoid';
import utils from '@/utils';

const AuthorizeDotNetModal = ({ amount, orders, isOpen, onClose }) => {
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();
  const [token, setToken] = useState('');
  const iframeRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (amount) {
      reset();
      handleGetPaymentTransaction();
    }
    console.log('amount', amount);
    console.log('orders', orders);
  }, [isOpen, amount, orders]);

  const reset = useCallback(() => setToken(null), []);

  const handleGetPaymentTransaction = async () => {
    const param = {
      amount: amount,
      invoiceNumber: `${utils.parseDateToStr(new Date(), '', true, '', true).replace(/ /g, '')}-${nanoid(5)}`,
      addOrders: JSON.stringify(orders),
    };

    const response = await fetch('http://localhost:4001/api/authorize/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });

    // 응답받은 데이터를 JSON 형식으로 변환
    const data = await response.json();
    if (data?.token) {
      setToken(data.token);
    }

    /*
    const result = await paymentTransactionApi.getPaymentTransaction(param);
    if (result?.errorCode === SUCCESS) {
      const token = result.data.token;
      setToken(token);
    } else {
      openModal({
        text: result.message,
        onAgree: () => {
          onClose();
        },
      });
    }
    */
  };

  useEffect(() => {
    if (token && typeof token === 'string' && token.length > 10) {
      setTimeout(() => {
        formRef.current?.submit();
      }, 100);
    }
  }, [token]);

  useEffect(() => {
    // 부모 창에서 iframe의 메시지를 처리
    const handleMessage = async (event) => {
      if (event.origin !== 'https://test.authorize.net') return; // origin 검증

      const data = event.data;
      if (data.action === 'cancel') {
        alert('실패');
        // onClose(); // 모달 닫기
      } else {
        alert('성공');
        /*
        const data = JSON.parse(event.data); // 필요시
        if (data?.responseCode === 1 && data.transId) {
          const res = await fetch(`/api/status?transId=${data.transId}`);
          const result = await res.json();
          if (result.status === 'success') {
            alert('결제 성공!');
          } else {
            alert('결제 실패');
          }
        }
        */
      }
    };

    if (typeof window !== 'undefined') {
      // message 이벤트 리스너 추가
      window.addEventListener('message', handleMessage);

      return () => {
        // 컴포넌트가 unmount될 때 리스너 제거
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="800px" h="800px">
        <ModalHeader>{localeText(LANGUAGES.ORDER.CHECK_OUT)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          {/* Form to POST token to iframe */}
          <form
            ref={formRef}
            id="send_hptoken"
            action="https://test.authorize.net/payment/payment"
            method="post"
            target="load_payment"
            style={{ display: 'none' }}
          >
            <input type="hidden" name="token" value={token} />
          </form>

          {/* Iframe to receive the POST */}
          <Box w="100%" h="100%">
            <iframe
              ref={iframeRef}
              title="Authorize.Net Payment"
              name="load_payment"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthorizeDotNetModal;
