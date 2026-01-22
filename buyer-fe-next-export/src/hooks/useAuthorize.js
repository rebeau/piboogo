'use client';

import { useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import useOrders from './useOrders';
import useMove from './useMove';
import { SUCCESS } from '@/constants/errorCode';
import ordersApi from '@/services/ordersApi';
import useModal from './useModal';
import useLocale from './useLocale';
import { LANGUAGES } from '@/constants/lang';

const useAuthorize = (props) => {
  const {
    isOpen: isOpenAuthorize,
    onOpen: onOpenAuthorize,
    onClose: onCloseAuthorize,
  } = useDisclosure();

  const { localeText } = useLocale();
  const { handleClearOrder } = useOrders();
  const { moveOrdersHistory } = useMove();
  const { openModal } = useModal();

  const [authorizeAmount, setAuthorizeAmount] = useState(0);
  const [authorizeData, setAuthorizeData] = useState({});

  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setyear] = useState('');
  const [cvv, setCvv] = useState('');

  const [isTokenGenerating, setIsTokenGenerating] = useState(false); // 토큰 생성 상태 추가

  useEffect(() => {
    // 클라이언트 측에서만 실행
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      // script.src = `https://jstest.authorize.net/v1/Accept.js`;
      script.src = `https://js.authorize.net/v1/Accept.js`;
      script.async = true;
      script.onload = () => {
        console.log('### AUTHORIZE ONLOADED ##');
      };
      document.body.appendChild(script);
    }
  }, []);

  const validateCardInfo = ({ cardNumber, month, year, cvv }) => {
    if (!cardNumber || cardNumber.length < 13) {
      return localeText(LANGUAGES.INFO_MSG.ENTER_CARD_NUMBER);
    }
    if (!month || Number(month) < 1 || Number(month) > 12) {
      return localeText(LANGUAGES.INFO_MSG.ENTER_MONTH);
    }
    if (!year || Number(year) < new Date().getFullYear() % 100) {
      return localeText(LANGUAGES.INFO_MSG.ENTER_YEAR);
    }
    if (!cvv || cvv.length < 3) {
      return localeText(LANGUAGES.INFO_MSG.ENTER_CVV);
    }
    return null;
  };
  const handlePayment = async (e) => {
    e.preventDefault();

    const validationError = validateCardInfo({ cardNumber, month, year, cvv });
    if (validationError) {
      openModal({ text: validationError });
      return;
    }

    const authData = {
      apiLoginID: process.env.NEXT_PUBLIC_AUTHORIZE_API_LOGIN_ID,
      clientKey: process.env.NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY,
    };

    const cardData = {
      cardNumber: cardNumber,
      month: month,
      year: year,
      cardCode: cvv,
    };

    /*
    const data = {
      dataDescriptor: 'COMMON.ACCEPT.INAPP.PAYMENT',
      dataValue:
        'eyJjb2RlIjoiNTBfMl8wNjAwMDUzOTk2QTg5MkYxNTM2ODk5N0VBMUFBNkQxNzVFQTZEQTZFRURFQ0NCNTcyMUJFNjczNEU2REVGODI2NkJBODU2MzMzQTlERUYxNEZCMDkyMEQzQzE3N0RGOTEzQjgwRUNDIiwidG9rZW4iOiI5NzQ3MDc4OTAzODgzMTAxNzAzNjAyIiwidiI6IjEuMSJ9',
    };
    handleApprove(data);
    */
    try {
      const paymentToken = await new Promise((resolve, reject) => {
        Accept.dispatchData({ authData, cardData }, (response) => {
          if (response.messages.resultCode === 'Ok') {
            resolve(response.opaqueData);
          } else {
            const errorMessage = response.messages.message
              ? response.messages.message[0].text
              : '토큰화 실패';
            reject(errorMessage);
          }
        });
      });

      if (paymentToken.dataDescriptor && paymentToken.dataValue) {
        const authorizeResult = paymentToken;
        authorizeData.paymentTransaction.dataDescriptor =
          authorizeResult.dataDescriptor;
        authorizeData.paymentTransaction.dataValue = authorizeResult.dataValue;
        handleApprove(authorizeData);
      } else {
        // console.error('토큰 추출중 오류가 발생했습니다.');
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.ISSUE_TOKEN_FAIL),
          onAgree: () => {
            onCloseAuthorize();
          },
        });
      }
    } catch (error) {
      // console.error('토큰화 처리 중 오류 발생:', error);
      openModal({
        text: error,
        onAgree: () => {
          onCloseAuthorize();
        },
      });
    } finally {
      setIsTokenGenerating(false); // 토큰 생성 완료
    }
  };

  const handleApprove = async (data) => {
    try {
      const param = { ...data };
      const result = await ordersApi.postOrders(param);
      if (result?.errorCode === SUCCESS) {
        openModal({
          text: result.message,
          onAgree: () => {
            handleClearOrder();
            onCloseAuthorize();
            moveOrdersHistory();
          },
        });
      }
    } catch (error) {
      // console.error('결제 처리 중 오류가 발생했습니다.');
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.PAYMENT_PROCESSING_ERROR),
        onAgree: () => {
          onCloseAuthorize();
        },
      });
    }
  };

  return {
    isOpenAuthorize,
    onOpenAuthorize,
    onCloseAuthorize,
    authorizeAmount,
    setAuthorizeAmount,
    authorizeData,
    setAuthorizeData,
    cardNumber,
    setCardNumber,
    expirationDate,
    setExpirationDate,
    month,
    setMonth,
    year,
    setyear,
    cvv,
    setCvv,
    handlePayment,
  };
};

export default useAuthorize;
