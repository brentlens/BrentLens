/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { SERVER_PLANS } from '@/configs/plans';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode',
});

// POST: Called by the onboarding flow to initiate checkout
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, planKey, statePayload } = body;

    // 1. Strict Server-Side Validation: Reject invalid or manipulated plan keys
    const plan = SERVER_PLANS[planKey];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid subscription tier selected.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // 2. Lock full configuration in Dodo's metadata (Tamper-proof by client)
    const session = await dodo.checkoutSessions.create({
      customer: {
        email: email || 'user@example.com',
        name: name || 'Valued Customer',
      },
      product_cart: [
        {
          product_id: plan.dodoProductId,
          quantity: 1,
        },
      ],
      billing_address: {
        city: 'City',
        country: (statePayload?.country as any) || 'US',
        state: 'State',
        street: 'Street',
        zipcode: '00000',
      },
      return_url: `${baseUrl}/onboarding`,
      metadata: {
        user_email: email,
        user_name: name || '',
        plan_key: plan.id,
        plan_amount: String(plan.amount),
        plan_label: plan.label,
        industry: statePayload?.industry || '',
        country: statePayload?.country || '',
      },
    });

    if (!session.checkout_url) {
      return NextResponse.json({ error: 'Failed to generate checkout link.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: session.checkout_url });
  } catch (error: any) {
    console.error('Dodo Checkout Creation Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Checkout initiation failed' },
      { status: 500 }
    );
  }
}