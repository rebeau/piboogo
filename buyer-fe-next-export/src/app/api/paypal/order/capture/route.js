// api/paypal/order/capture/route.ts

import { NextResponse } from 'next/server';
import { base, generateAccessToken } from '../../token/route';

export async function POST(request) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json({
        ok: false,
        code: 400,
        msg: 'Invalid Order ID',
      });
    }

    // 액세스 토큰 생성
    const accessToken = await generateAccessToken();
    if (!accessToken) {
      throw new Error('PayPal access token 생성 실패');
    }

    // 결제 승인 요청
    const response = await fetch(
      `${base}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        code: response.status,
        msg: data?.message || 'PayPal 결제 승인 실패',
        error: data,
      });
    }

    // 성공 응답 반환
    return NextResponse.json({
      ok: true,
      code: response.status,
      data,
    });
  } catch (error) {
    console.error('PayPal 결제 승인 중 오류 발생:', error);
    return NextResponse.json({
      ok: false,
      code: 500,
      msg: '서버 내부 오류 - PayPal 결제 승인 실패',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
