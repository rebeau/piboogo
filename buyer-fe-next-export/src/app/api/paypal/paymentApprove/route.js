import axios from 'axios';

export async function POST(req) {
  try {
    const { orderID } = await req.json();
    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      `https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return new Response(
      JSON.stringify({
        message: 'Payment approved successfully',
        data: response.data,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error during payment approval', error);

    return new Response(
      JSON.stringify({
        message: 'Payment approval failed',
        error: error?.response?.data || error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  return response.data.access_token;
}
