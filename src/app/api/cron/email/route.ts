/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/email.service';
import { EMAIL_CONFIG } from '@/config/email.config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleCronExecution(req);
}

export async function POST(req: NextRequest) {
  return handleCronExecution(req);
}

async function handleCronExecution(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  // Accepts Vercel's default CRON_SECRET or your custom config secret
  const expectedSecret = process.env.CRON_SECRET || EMAIL_CONFIG.app.cronSecret;

  // Protect Cron Endpoint from unauthorized invocations
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized invocation' }, { status: 401 });
  }

  try {
    const result = await EmailService.processCampaigns();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('[CRON_EMAIL_EXCEPTION]', error);
    return NextResponse.json({ error: error?.message || 'Internal processor error' }, { status: 500 });
  }
}