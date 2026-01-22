'use client';

import { useEffect } from 'react';

const PaymentResultPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const result = params.get('result');
    const transactionId = params.get('transactionId');

    if (window.opener) {
      window.opener.postMessage(
        {
          action: result === 'cancel' ? 'cancel' : 'success',
          transactionId: transactionId || null,
        },
        'https://piboogo.com',
      );

      window.close();
    }
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>에러...</h2>
    </div>
  );
};

export default PaymentResultPage;
