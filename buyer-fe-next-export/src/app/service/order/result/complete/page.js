'use client';

import { useEffect } from 'react';

const PaymentResultPage = () => {
  useEffect(() => {
    const invoiceNum = new URLSearchParams(window.location.search).get(
      'invoiceNum',
    );

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
      <h2>성공...</h2>
    </div>
  );
};

export default PaymentResultPage;
