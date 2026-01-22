// app/api/authorize/route.ts

import { NextResponse } from 'next/server';

export async function POST(req) {
  const API_LOGIN_ID = process.env.AUTHORIZE_API_LOGIN_ID?.trim();
  const TRANSACTION_KEY = process.env.AUTHORIZE_TRANSACTION_KEY?.trim();

  try {
    const body = await req.json();
    const { dataDescriptor, dataValue, amount } = body;

    if (!dataDescriptor || !dataValue || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const data = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: API_LOGIN_ID,
          transactionKey: TRANSACTION_KEY,
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: String(amount),
          payment: {
            opaqueData: {
              dataDescriptor: dataDescriptor,
              dataValue: dataValue,
            },
          },
        },
      },
    };

    const response = await fetch(
      'https://apitest.authorize.net/xml/v1/request.api',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
    const jsonData = await response.json();
    return Response.json(jsonData);
  } catch (error) {
    console.error('[API] createTransaction error:', error);
    return NextResponse.json(
      { error: '서버 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
