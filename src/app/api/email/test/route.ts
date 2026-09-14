/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { EmailTemplateEngine } from '@/lib/email/email.template';
import { HostingerSmtpProvider } from '@/lib/email/providers/hostinger.provider';
import { EMAIL_CONFIG } from '@/config/email.config';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${EMAIL_CONFIG.app.cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { templateSlug, email, previewOnly } = await req.json();

    if (!templateSlug || !email) {
      return NextResponse.json({ error: 'templateSlug and email are required.' }, { status: 400 });
    }

    const { data: template, error: tErr } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('slug', templateSlug)
      .single();

    if (tErr || !template) {
      return NextResponse.json({ error: `Template not found: ${templateSlug}` }, { status: 404 });
    }

    const rendered = EmailTemplateEngine.renderTemplate({
      rawHtml: template.html_content,
      rawText: template.text_content,
      subject: template.subject,
      ctaText: template.cta_text,
      ctaUrl: template.cta_url,
      variables: {
        first_name: 'Tester',
        last_name: 'Developer',
        email,
        product_url: process.env.NEXT_PUBLIC_SITE_URL || ''
      },
      userId: '00000000-0000-0000-0000-000000000000',
      recipientEmail: email,
    });

    if (previewOnly) {
      return NextResponse.json({ preview: rendered });
    }

    const provider = new HostingerSmtpProvider();
    const result = await provider.sendEmail({
      to: email,
      subject: `[TEST] ${rendered.subject}`,
      html: rendered.html,
      text: rendered.text,
    });

    return NextResponse.json({ success: result.success, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}