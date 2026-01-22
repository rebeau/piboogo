'use client';

import { Box, Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MainContainer from '@/components/layout/MainContainer';
import { openStripeModal, StripeModal } from '@/hooks/useStripePayment';

const TestPaymentBackdoorPage = () => {
  const [finalOrderData, setFinalOrderData] = useState({});
  useEffect(() => {
    const handleMessage = (event) => {
      // 메시지를 보낸 origin 검증 (보안을 위해 꼭 확인)
      if (event.origin !== 'https://piboogo.com') return;

      // 메시지 처리 (예: 결제 성공 여부)

      console.log('결제 결과:', event.data);

      // console.log('결제 상태:', status, data);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleOrderButton = async () => {
    const param = {
      amount: 6,
      userType: 1,
    };
    setFinalOrderData(param);

    const actualAmount = 12;

    setTimeout(async () => {
      const amountInCents = Number(actualAmount) * 100;
      openStripeModal({ amount: amountInCents, orders: param }).catch(
        console.error('결제 오류'),
      );
    }, 10);
  };

  return (
    <MainContainer>
      <Box
        w={'100%'}
        h={'5.5rem'}
        position={'fixed'}
        bottom={0}
        p={'1rem'}
        borderTop={'1px solid #AEBDCA'}
        bg={'#FFF'}
      >
        <Button
          onClick={() => {
            handleOrderButton();
          }}
          w={'100%'}
          h={'100%'}
          px={'2rem'}
          py={'0.88rem'}
          borderRadius={'0.25rem'}
          borderTop={'1px solid #73829D'}
          bg={'#66809C'}
        >
          <Text
            color={'#FFF'}
            fontSize={'1.25rem'}
            fontWeight={400}
            lineHeight={'2.25rem'}
          >
            {'결제'}
          </Text>
        </Button>
      </Box>

      <StripeModal orderDataStripe={finalOrderData} />
    </MainContainer>
  );
};

export default TestPaymentBackdoorPage;
