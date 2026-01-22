import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// 시크릿 키
// sk_test_51RnlZWQdRtiwD2DvQqlD339gvOaYmdtWQ762Ruk3fGQ0Khxr5a9zZQynaH421M4EUbf4R82qgYYGzHjQPfYxXndE00EI5QINwT
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { amount, addOrders } = await req.json();

  if (!amount || typeof amount !== 'number') {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      // authorize dot net 처럼를 addOrders 를 아래에 넣으면 웹훅으로 받아집니다.
      orderId: 'ORDER_12345', // 예시
      userId: 'USER_56789', // 예시
      addOrders: addOrders,
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}

/*
Stripe 결제 플로우
1. 프론트 → 서버 : 결제 요청 (해당 파일 API)
  - 사용자가 "결제하기" 클릭
  - 프론트에서 서버 API 호출 → 서버가 Payment Intent 생성 (client_secret 발급) 

2. 서버 → 프론트 : client_secret 반환
  - 서버는 Stripe SDK로 Intent 생성 후 client_secret 전달

3. 프론트 : 카드 입력 & 결제 시도 (stripe ui 모듈을 통해 카드정보 등 입력후 결제 요청)
  - 프론트에서 stripe.confirmCardPayment(client_secret) 실행
  - 카드 정보는 Stripe.js가 Stripe 서버로 직접 전송 (민감정보 안전)

4. Stripe : 결제 처리 (프론트 stripe ui 모듈에서 처리)
  - 카드 승인/거절, 3D Secure 인증 등 진행
  - 결과를 프론트에 즉시 전달 (succeeded, requires_action 등)

5. 서버 : 웹훅으로 최종 상태 수신 (ui 모듈에서 endpoint로 웹훅 전달, 현재 https://piboogo.com/api/stripe/webhook 로 설정되어 있음, 변경 가능)
  - Stripe가 payment_intent.succeeded 이벤트를 서버로 POST
  - 서버는 DB 업데이트, 영수증 발송 등 후처리 수행

6. 프론트 : 1번 시점에 나온 paymentIntent.id 값으로 풀링하며 결제 체크
*/
