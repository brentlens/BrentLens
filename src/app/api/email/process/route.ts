import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/email.service';
import { EMAIL_CONFIG } from '@/config/email.config';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${EMAIL_CONFIG.app.cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { batchSize } = await req.json().catch(() => ({ batchSize: undefined }));
  const result = await EmailService.processCampaigns(batchSize);
  return NextResponse.json(result);
}