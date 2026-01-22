import { SUCCESS } from '@/constants/errorCode';
import paymentTransactionApi from '@/services/paymentTransactionApi';
import { useCallback, useState } from 'react';

const useAuthorizeHosted = () => {
  const [token, setToken] = useState(null);

  const generateToken = useCallback(async (amount, returnUrl, cancelUrl) => {
    const param = {
      amount: amount,
    };
    const result = await paymentTransactionApi.getPaymentTransaction(param);
    if (result?.errorCode === SUCCESS) {
      const token = result.data.token;
      setToken(token);
    } else {
      console.error('결제 토큰을 생성하는 데 실패했습니다.', result);
    }
  }, []);

  const reset = useCallback(() => setToken(null), []);

  return {
    token,
    setToken,
    generateToken,
    reset,
  };
};

export default useAuthorizeHosted;
