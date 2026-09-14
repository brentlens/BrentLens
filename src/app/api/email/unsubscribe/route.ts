import { NextRequest, NextResponse } from 'next/server';
import { EmailTemplateEngine } from '@/lib/email/email.template';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Invalid or missing unsubscribe token.', { status: 400 });
  }

  const { valid, userId } = EmailTemplateEngine.verifyUnsubscribeToken(token);

  if (!valid || !userId) {
    return new NextResponse('Invalid or expired token.', { status: 403 });
  }

  // Update preferences table
  await supabaseAdmin
    .from('email_preferences')
    .upsert({
      user_id: userId,
      marketing_emails: false,
      waitlist_emails: false,
      product_emails: false,
      unsubscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  // Update active campaigns for this user to unsubscribed
  await supabaseAdmin
    .from('user_email_campaigns')
    .update({
      status: 'unsubscribed',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head><title>Unsubscribed</title></head>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb;">
        <div style="background: white; padding: 40px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center; max-width: 400px;">
          <h2 style="color: #111827; margin-top: 0;">Unsubscribed</h2>
          <p style="color: #4b5563;">You have been successfully removed from our automated campaign emails.</p>
        </div>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}