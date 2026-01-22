// app/api/authorize/token/route.js

export async function POST(request) {
  const body = await request.json();

  /*
  amount: amount,
      invoiceNumber: `${utils.parseDateToStr(new Date(), '', true, '', true).replace(/ /g, '')}-${nanoid(5)}`,
      addOrders
      */
  const { amount, invoiceNumber, addOrders } = body;

  // const ENDPOINT = 'https://apitest.authorize.net/xml/v1/request.api'; // dev
  const ENDPOINT = 'https://api2.authorize.net/xml/v1/request.api'; // real

  const API_LOGIN_ID = process.env.AUTHORIZE_API_LOGIN_ID?.trim();
  const TRANSACTION_KEY = process.env.AUTHORIZE_TRANSACTION_KEY?.trim();

  try {
    console.log('amount', amount);
    // console.log('param', param);
    console.log('API_LOGIN_ID', API_LOGIN_ID);
    console.log('TRANSACTION_KEY', TRANSACTION_KEY);
    console.log('ENDPOINT', ENDPOINT);

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        getHostedPaymentPageRequest: {
          merchantAuthentication: {
            name: API_LOGIN_ID,
            transactionKey: TRANSACTION_KEY,
          },
          transactionRequest: {
            transactionType: 'authCaptureTransaction',
            amount: amount,
            order: {
              invoiceNumber: invoiceNumber, // 프론트에서 전달 받고 서버로 호출하는 값
            },
            userFields: {
              // userFields를 사용하여 사용자 정의 값 추가
              userField: [
                {
                  name: 'addOrders',
                  value: JSON.stringify(addOrders),
                },
              ],
            },
          },
          hostedPaymentSettings: {
            setting: [
              {
                settingName: 'hostedPaymentReturnOptions',
                settingValue: JSON.stringify({
                  url: `https://piboogo.com/service/order/result/complete?invoiceNum=${invoiceNumber}`,
                  cancelUrl: 'https://piboogo.com/service/order/result/cancel',
                  showReceipt: false,
                }),
              },
            ],
          },
        },
      }),
    });

    const data = await response.json();
    const token =
      data?.token || data?.getHostedPaymentPageResponse?.token || null;

    console.log('data', JSON.stringify(data, null, 2));
    if (!token) {
      return Response.json({ error: 'Token is missing' }, { status: 500 });
    }

    return Response.json({ token });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to generate token' },
      { status: 500 },
    );
  }
}
