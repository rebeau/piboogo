// /api/payment-status/route.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get('id');

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return NextResponse.json({ status: paymentIntent.status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
