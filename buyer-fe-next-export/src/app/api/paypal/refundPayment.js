// pages/api/refundPayment.js (서버 측)
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderID } = req.body;

    try {
      // PayPal에서 제공한 Access Token을 사용하여 API 호출
      const accessToken = await getPayPalAccessToken();

      // 1. 먼저 결제 세부 정보를 얻기 위해 /v2/checkout/orders/{orderID} API 호출
      const orderResponse = await fetch(
        `https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const orderData = await orderResponse.json();
      if (!orderData.purchase_units || orderData.purchase_units.length === 0) {
        return res.status(400).json({ message: 'Order data is not valid.' });
      }

      const captureID = orderData.purchase_units[0].payments.captures[0].id;

      // 2. /v2/payments/captures/{capture_id}/refund 호출하여 환불 처리
      const refundResponse = await fetch(
        `https://api.sandbox.paypal.com/v2/payments/captures/${captureID}/refund`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: {
              value: orderData.purchase_units[0].amount.value,
              currency_code: orderData.purchase_units[0].amount.currency_code,
            },
          }),
        },
      );

      const refundData = await refundResponse.json();

      if (refundResponse.ok) {
        return res
          .status(200)
          .json({ message: 'Payment refunded successfully', data: refundData });
      } else {
        return res
          .status(500)
          .json({ message: 'Refund failed', error: refundData });
      }
    } catch (error) {
      console.error('Error during payment refund', error);
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// PayPal의 액세스 토큰을 얻는 함수
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID; // 환경 변수에서 PayPal 클라이언트 ID
  const secret = process.env.PAYPAL_SECRET; // 환경 변수에서 PayPal 비밀 키

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const response = await fetch(
    'https://api.sandbox.paypal.com/v1/oauth2/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    },
  );

  const data = await response.json();
  return data.access_token; // 액세스 토큰 반환
}
