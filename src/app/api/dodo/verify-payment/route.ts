/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { SERVER_PLANS } from '@/configs/plans';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode',
});

// export async function POST(req: Request) {
//   try {
//     const { paymentId, subscriptionId } = await req.json();

//     if (subscriptionId) {
//       const sub = await dodo.subscriptions.retrieve(subscriptionId);
//       const isSuccess = sub.status === 'active' || sub.status === 'on_hold';
//       return NextResponse.json({ success: isSuccess, status: sub.status });
//     }

//     if (paymentId) {
//       const payment = await dodo.payments.retrieve(paymentId);
//       const isSuccess = payment.status === 'succeeded';
//       return NextResponse.json({ success: isSuccess, status: payment.status });
//     }

//     return NextResponse.json({ success: false, error: 'No transaction ID provided' }, { status: 400 });
//   } catch (error: any) {
//     console.error('Payment Verification Error:', error);
//     return NextResponse.json(
//       { success: false, error: error?.message || 'Verification check failed' },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: Request) {
  try {
    const { paymentId, subscriptionId } = await req.json();

    let transaction: any = null;
    let isSuccess = false;

    // 1. Validate status directly from Dodo API
    if (subscriptionId) {
      transaction = await dodo.subscriptions.retrieve(subscriptionId);
      isSuccess = transaction.status === 'active' || transaction.status === 'on_hold';
    } else if (paymentId) {
      transaction = await dodo.payments.retrieve(paymentId);
      isSuccess = transaction.status === 'succeeded';
    } else {
      return NextResponse.json(
        { success: false, error: 'No transaction ID provided' },
        { status: 400 }
      );
    }

    if (!isSuccess || !transaction) {
      return NextResponse.json({
        success: false,
        status: transaction?.status || 'failed',
        error: 'Transaction was not successful or is still pending.',
      });
    }

    // 2. Read tamper-proof metadata locked during checkout creation
    const metadata = transaction.metadata || {};
    const planKey = metadata.plan_key || 'pro';
    const plan = SERVER_PLANS[planKey];

    return NextResponse.json({
      success: true,
      status: transaction.status,
      verifiedData: {
        email: metadata.user_email || transaction.customer?.email || '',
        name: metadata.user_name || transaction.customer?.name || '',
        planKey: planKey,
        planLabel: plan ? plan.label : metadata.plan_label,
        planAmount: plan ? plan.amount : Number(metadata.plan_amount || 0),
        industry: metadata.industry || '',
        country: metadata.country || '',
        subscriptionId: subscriptionId || null,
        paymentId: paymentId || null,
      },
    });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Verification check failed' },
      { status: 500 }
    );
  }
}