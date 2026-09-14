/* eslint-disable @typescript-eslint/no-explicit-any */
import { HostingerSmtpProvider } from './providers/hostinger.provider';
import { EmailScheduler } from './email.scheduler';
import { EmailTemplateEngine } from './email.template';
import { EMAIL_CONFIG } from '@/config/email.config';
import { supabaseAdmin } from '../supabaseAdmin';

export class EmailProcessor {
  private provider: HostingerSmtpProvider;

  constructor() {
    this.provider = new HostingerSmtpProvider();
  }

  /**
   * Main cron processor: claims batches atomically and triggers processing
   */
  public async processCampaignBatch(limit: number = EMAIL_CONFIG.app.batchSize) {
    console.log(`[EMAIL_PROCESSOR_STARTED] Batch limit: ${limit}`);

    // Call PostgreSQL atomic claiming function using FOR UPDATE SKIP LOCKED
    const { data: claims, error: claimError } = await supabaseAdmin.rpc('claim_eligible_campaign_users', {
      p_batch_size: limit,
    });

    if (claimError) {
      console.error('[EMAIL_PROCESSOR_ERROR] Failed to claim users:', claimError.message);
      return { success: false, error: claimError.message };
    }

    if (!claims || claims.length === 0) {
      console.log('[EMAIL_PROCESSOR_FINISHED] No eligible candidates to process.');
      return { success: true, processed: 0, sent: 0, skipped: 0, failed: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const item of claims) {
      try {
        const result = await this.processSingleUserCampaign(item);
        if (result.status === 'sent') sentCount++;
        else if (result.status === 'skipped') skippedCount++;
        else if (result.status === 'failed') failedCount++;
      } catch (err: any) {
        failedCount++;
        console.error(`[EMAIL_CRITICAL_FAILURE] User ${item.user_id}:`, err.message);
      }
    }

    console.log(`[EMAIL_PROCESSOR_FINISHED] Processed: ${claims.length}, Sent: ${sentCount}, Skipped: ${skippedCount}, Failed: ${failedCount}`);
    return {
      success: true,
      processed: claims.length,
      sent: sentCount,
      skipped: skippedCount,
      failed: failedCount,
    };
  }

  private async processSingleUserCampaign(item: any): Promise<{ status: 'sent' | 'skipped' | 'failed' }> {
    // 1. Resolve next eligible template
    const { template, isCompleted } = await EmailScheduler.resolveNextTemplate({
      userId: item.user_id,
      campaignId: item.campaign_id,
      mode: item.campaign_mode,
      restartAfterCompletion: item.restart_after_completion,
    });

    if (isCompleted || !template) {
      await supabaseAdmin
        .from('user_email_campaigns')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.user_campaign_id);

      return { status: 'skipped' };
    }

    // 2. Insert processing record in delivery log to guarantee idempotency
    const { data: logRecord, error: logErr } = await supabaseAdmin
      .from('email_delivery_logs')
      .insert({
        user_id: item.user_id,
        campaign_id: item.campaign_id,
        template_id: template.id,
        recipient_email: item.recipient_email,
        subject: template.subject,
        status: 'processing',
        provider: this.provider.name,
        attempt_count: 1,
        scheduled_at: new Date().toISOString(),
        audience_type: 'waitlist'
      })
      .select('id')
      .single();

    if (logErr || !logRecord) {
      // Duplicate protection: log already exists in processing/sent state
      return { status: 'skipped' };
    }

    // 3. Render template
    const rendered = EmailTemplateEngine.renderTemplate({
      rawHtml: template.html_content,
      rawText: template.text_content,
      subject: template.subject,
      ctaText: template.cta_text,
      ctaUrl: template.cta_url,
      variables: {
        first_name: item.first_name || 'there',
        last_name: item.last_name || '',
        email: item.recipient_email,
      },
      userId: item.user_id,
      recipientEmail: item.recipient_email,
    });

    // 4. Send via provider
    const sendResult = await this.provider.sendEmail({
      to: item.recipient_email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    if (sendResult.success) {
      // 5a. Log success
      await supabaseAdmin
        .from('email_delivery_logs')
        .update({
          status: 'sent',
          message_id: sendResult.messageId,
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', logRecord.id);

      // Schedule next email date
      const nextDate = EmailScheduler.calculateNextSendDate(template.delay_value, template.delay_unit);

      await supabaseAdmin
        .from('user_email_campaigns')
        .update({
          current_template_id: template.id,
          last_sent_at: new Date().toISOString(),
          next_send_at: nextDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.user_campaign_id);

      console.log(`[EMAIL_SENT] Recipient: ${item.recipient_email} | Template: ${template.slug}`);
      return { status: 'sent' };
    } else {
      // 5b. Log failure & retry schedule with exponential backoff
      await supabaseAdmin
        .from('email_delivery_logs')
        .update({
          status: 'failed',
          error_message: sendResult.error,
          updated_at: new Date().toISOString(),
        })
        .eq('id', logRecord.id);

      // Delay retry by 2 hours
      const retryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
      await supabaseAdmin
        .from('user_email_campaigns')
        .update({
          next_send_at: retryDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.user_campaign_id);

      console.error(`[EMAIL_FAILED] Recipient: ${item.recipient_email} | Error: ${sendResult.error}`);
      return { status: 'failed' };
    }
  }
}