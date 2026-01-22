// src/utils/paypal/token.js

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env;

const env = process.env.NEXT_PUBLIC_NODE_ENV;
const isDev = env === 'development';

// dev, prod 환경에서의 api base 주소가 다름
/*
export const base = isDev
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';
*/
export const base = 'https://api-m.sandbox.paypal.com';

export const generateAccessToken = async () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
    throw new Error('MISSING_API_CREDENTIALS');
  }

  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET_KEY).toString(
    'base64',
  );

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('PayPal token fetch failed:', data);
    throw new Error(data?.error_description || 'Failed to get access token');
  }

  return data.access_token;
};
