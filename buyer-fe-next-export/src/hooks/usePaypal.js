'use client';

import Paypal from '@public/svgs/simbol/paypal.svg';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import utils from '@/utils';
import useModal from '@/hooks/useModal';
import axios from 'axios';
import ordersApi from '@/services/ordersApi';
import { SUCCESS } from '@/constants/errorCode';
import useOrders from './useOrders';
import useMove from './useMove';
import useLocale from './useLocale';
import { COUNTRY } from '@/constants/lang';

const usePaypal = () => {
  const {
    isOpen: isOpenPaypal,
    onOpen: onOpenPaypal,
    onClose: onClosePaypal,
  } = useDisclosure();

  const { handleClearOrder } = useOrders();
  const { moveOrdersHistory } = useMove();
  const { openModal } = useModal();

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const { lang } = useLocale();
  const [orderData, setOrderData] = useState({});
  const [price, setPrice] = useState(0);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    if (isOpenPaypal && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&locale=${lang === COUNTRY.COUNTRY_INFO.KR.LANG ? 'ko_KR' : 'en_US'}`;
      script.async = true;
      script.onload = () => {
        console.log('### PAYPAL ONLOADED ##');
        setPaypalLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      onClosePaypal();
      setPaypalLoaded(false);
    }
  }, [isOpenPaypal]);

  const handleApprove = async (data, actions) => {
    if (!orderData || Object.keys(orderData).length === 0) {
      throw new Error('주문 정보가 없습니다.');
    }

    try {
      const orderID = data.orderID;

      const response = await axios.post('/api/paypal/order/capture', {
        orderID,
      });

      if (!response.data.ok) {
        throw new Error('결제 처리 실패');
      } else if (response.data.data) {
        console.log('response.data.data', response.data.data);
        console.log('orderData', orderData);
        const result = await ordersApi.postOrders(orderData);

        if (result?.errorCode === SUCCESS) {
          openModal({
            text: result.message,
            onAgree: () => {
              handleClearOrder();
              onClosePaypal();
              moveOrdersHistory();
            },
          });
        }
      }
    } catch (error) {
      openModal({
        text: error?.message || '결제 처리 중 오류가 발생했습니다.',
        onAgree: () => {
          onClosePaypal();
        },
      });
    }
  };

  useEffect(() => {
    if (isOpenPaypal && paypalLoaded && window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price,
                  },
                },
              ],
            });
          },
          onApprove: handleApprove,
          onError: (err) => {
            console.error('결제 오류:', err);
          },
        })
        .render('#paypal-button-container');
    }
  }, [paypalLoaded, isOpenPaypal, price]);

  return {
    setPrice,
    orderData,
    setOrderData,
    paypalLoaded,
    isOpenPaypal,
    onOpenPaypal,
    onClosePaypal,
  };
};

export default usePaypal;
