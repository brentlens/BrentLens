
import { HostingerSmtpProvider } from './providers/hostinger.provider';
import { EmailTemplateEngine } from './email.template';
import { EmailProcessor } from './email.processor';
import { EmailRecipient, BulkSendResult } from '@/types/email';
import { supabaseAdmin } from '../supabaseAdmin';
import { EmailScheduler } from './email.scheduler';

export class EmailService {
  private static provider = new HostingerSmtpProvider();
  private static processor = new EmailProcessor();

  /**
   * Initializes user campaign state idempotently upon signup
   */
  public static async initializeUserCampaigns(userId: string): Promise<void> {
    const { data: user, error: uErr } = await supabaseAdmin
      .from('users_profile')
      .select('id, email, user_type')
      .eq('id', userId)
      .single();

    if (uErr || !user) throw new Error(`User not found: ${userId}`);

    // Match active campaigns targeting this audience type or 'all'
    const { data: campaigns, error: cErr } = await supabaseAdmin
      .from('email_campaigns')
      .select('id, audience_type')
      .eq('status', 'active')
      .or(`audience_type.eq.${user.user_type},audience_type.eq.all`);

    if (cErr || !campaigns) return;

    for (const campaign of campaigns) {
      // Check if row already exists
      const { data: existing } = await supabaseAdmin
        .from('user_email_campaigns')
        .select('id')
        .eq('user_id', userId)
        .eq('campaign_id', campaign.id)
        .maybeSingle();

      if (!existing) {
        await supabaseAdmin.from('user_email_campaigns').insert({
          user_id: userId,
          campaign_id: campaign.id,
          status: 'active',
          next_send_at: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Immediate Transactional Signup Email using DB template
   */
  public static async sendSignupWelcomeEmail(user: { id: string; email: string; firstName?: string }): Promise<void> {
    const templateSlug = 'waitlist-welcome';
    const { data: template } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('slug', templateSlug)
      .single();

    if (!template) {
      console.warn(`[EMAIL_WARN] Welcome template ${templateSlug} not found in database.`);
      return;
    }

    const rendered = EmailTemplateEngine.renderTemplate({
      rawHtml: template.html_content,
      rawText: template.text_content,
      subject: template.subject,
      ctaText: template.cta_text,
      ctaUrl: template.cta_url,
      variables: {
        first_name: user.firstName || 'there',
        email: user.email,
      },
      userId: user.id,
      recipientEmail: user.email,
    });

    const result = await this.provider.sendEmail({
      to: user.email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    await supabaseAdmin.from('email_delivery_logs').insert({
      user_id: user.id,
      template_id: template.id,
      recipient_email: user.email,
      subject: rendered.subject,
      status: result.success ? 'sent' : 'failed',
      provider: this.provider.name,
      message_id: result.messageId,
      error_message: result.error,
      sent_at: result.success ? new Date().toISOString() : null,
      scheduled_at: new Date().toISOString(),
    });
  }

  /**
   * Reusable bulk dispatcher with strict safety guarantees
   */
  public static async sendBulkEmails(params: {
    recipients: EmailRecipient[];
    templateSlug: string;
  }): Promise<BulkSendResult> {
    const { recipients, templateSlug } = params;

    const { data: template, error: tErr } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('slug', templateSlug)
      .single();

    if (tErr || !template) {
      throw new Error(`Template not found: ${templateSlug}`);
    }

    let sent = 0;
    let failed = 0;
    const skipped = 0;
    const errors: Array<{ recipient: string; error: string }> = [];

    for (const r of recipients) {
      const rendered = EmailTemplateEngine.renderTemplate({
        rawHtml: template.html_content,
        rawText: template.text_content,
        subject: template.subject,
        ctaText: template.cta_text,
        ctaUrl: template.cta_url,
        variables: {
          first_name: r.firstName || '',
          last_name: r.lastName || '',
          email: r.email,
          ...(r.customVariables || {}),
        },
        userId: r.userId,
        recipientEmail: r.email,
      });

      const res = await this.provider.sendEmail({
        to: r.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });

      if (res.success) {
        sent++;
      } else {
        failed++;
        errors.push({ recipient: r.email, error: res.error || 'Unknown error' });
      }
    }

    return {
      success: failed === 0,
      processed: recipients.length,
      sent,
      failed,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Runs the batch processor
   */
  public static async processCampaigns(limit?: number) {
    return this.processor.processCampaignBatch(limit);
  }

  public static async verifySmtp() {
    return this.provider.verifyConnection();
  }

  public static async handleSubscribedUserOnboarding(params: {
    userId: string;
    email: string;
    name?: string;
  }): Promise<void> {
    const { userId, email, name } = params;
    const normalizedEmail = email.trim().toLowerCase();
    const firstName = name?.trim() ? name.trim().split(" ")[0] : "there";

    // 1. Opt-in record
    await supabaseAdmin
      .from("email_preferences")
      .upsert(
        { email: normalizedEmail, marketing_emails: true, updated_at: new Date().toISOString() },
        { onConflict: "email" }
      );

    // 2. Terminate any active waitlist campaigns for this user
    const { data: waitlistRecord } = await supabaseAdmin
      .from("brent_waitlistUsers")
      .select("id")
      .ilike("user_email", normalizedEmail)
      .maybeSingle();

    if (waitlistRecord) {
      await supabaseAdmin
        .from("user_email_campaigns")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", waitlistRecord.id)
        .eq("audience_type", "waitlist");

      await supabaseAdmin
        .from("brent_waitlistUsers")
        .update({ isRegistered: true, status: "migrated" })
        .eq("id", waitlistRecord.id);
    }

    // 3. Resolve Campaign
    const { data: campaign } = await supabaseAdmin
      .from("email_campaigns")
      .select("id")
      .eq("slug", "pre-reg-subscribed")
      .eq("status", "active")
      .single();

    if (!campaign) {
      console.error('[EMAIL_ERROR] Campaign "pre-reg-subscribed" not found or inactive.');
      return;
    }

    // 4. Fetch Email 1 & Email 2 from DB
    const { data: templates } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("campaign_id", campaign.id)
      .in("sequence_order", [1, 2])
      .order("sequence_order", { ascending: true });

    const email1 = templates?.find((t) => t.sequence_order === 1);
    const email2 = templates?.find((t) => t.sequence_order === 2);

    if (!email1) {
      console.error("[EMAIL_ERROR] Sequence 1 template missing for subscriber campaign.");
      return;
    }

    // Calculate founding member number
    const { count } = await supabaseAdmin
      .from("users_profile")
      .select("id", { count: "exact", head: true });
    const memberNumber = count || 1;

    // 5. Render and send Email 1 immediately
    const rendered = EmailTemplateEngine.renderTemplate({
      rawHtml: email1.html_content,
      rawText: email1.text_content,
      subject: email1.subject,
      ctaText: email1.cta_text,
      ctaUrl: email1.cta_url,
      variables: {
        first_name: firstName,
        email: normalizedEmail,
        member_number: String(memberNumber),
      },
      userId,
      recipientEmail: normalizedEmail,
    });

    const sendRes = await this.provider.sendEmail({
      to: normalizedEmail,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    // 6. Log Email 1
    await supabaseAdmin.from("email_delivery_logs").insert({
      user_id: userId,
      audience_type: "subscribed",
      campaign_id: campaign.id,
      template_id: email1.id,
      recipient_email: normalizedEmail,
      subject: rendered.subject,
      status: sendRes.success ? "sent" : "failed",
      provider: this.provider.name,
      message_id: sendRes.messageId || null,
      error_message: sendRes.error || null,
      sent_at: sendRes.success ? new Date().toISOString() : null,
      scheduled_at: new Date().toISOString(),
    });

    // 7. Schedule Email 2 in user_email_campaigns
    const nextSendDate = email2
      ? EmailScheduler.calculateNextSendDate(email2.delay_value, email2.delay_unit)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await supabaseAdmin.from("user_email_campaigns").upsert(
      {
        user_id: userId,
        audience_type: "subscribed",
        campaign_id: campaign.id,
        current_template_id: email1.id,
        status: "active",
        started_at: new Date().toISOString(),
        last_sent_at: new Date().toISOString(),
        next_send_at: nextSendDate.toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,campaign_id" }
    );
  }

  // ==========================================================================
  // 2. FREE WAITLIST USER ONBOARDING
  // ==========================================================================
  public static async handleWaitlistUserOnboarding(params: {
    waitlistUserId: string;
    email: string;
    name?: string;
  }): Promise<void> {
    const { waitlistUserId, email, name } = params;
    const normalizedEmail = email.trim().toLowerCase();
    const firstName = name?.trim() ? name.trim().split(" ")[0] : "there";

    // 1. Opt-in record
    await supabaseAdmin
      .from("email_preferences")
      .upsert(
        { email: normalizedEmail, marketing_emails: true, updated_at: new Date().toISOString() },
        { onConflict: "email" }
      );

    // 2. Resolve Waitlist Campaign
    const campaignId = "9ec594a4-b1c0-4416-b262-76d45f39e517";
    const { data: campaign } = await supabaseAdmin
      .from("email_campaigns")
      .select("id")
      .eq("id", campaignId)
      .eq("status", "active")
      .single();

    if (!campaign) {
      console.error(`[EMAIL_ERROR] Waitlist campaign ${campaignId} not active.`);
      return;
    }

    // 3. Fetch Email 1 & Email 2 from DB
    const { data: templates } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("campaign_id", campaign.id)
      .in("sequence_order", [1, 2])
      .order("sequence_order", { ascending: true });

    const email1 = templates?.find((t) => t.sequence_order === 1);
    const email2 = templates?.find((t) => t.sequence_order === 2);

    if (!email1) {
      console.error("[EMAIL_ERROR] Sequence 1 template missing for waitlist campaign.");
      return;
    }

    // 4. Render and send Email 1 immediately
    const rendered = EmailTemplateEngine.renderTemplate({
      rawHtml: email1.html_content,
      rawText: email1.text_content,
      subject: email1.subject,
      ctaText: email1.cta_text,
      ctaUrl: email1.cta_url,
      variables: {
        first_name: firstName,
        email: normalizedEmail,
      },
      userId: waitlistUserId,
      recipientEmail: normalizedEmail,
    });

    const sendRes = await this.provider.sendEmail({
      to: normalizedEmail,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    // 5. Log Email 1
    await supabaseAdmin.from("email_delivery_logs").insert({
      user_id: waitlistUserId,
      audience_type: "waitlist",
      campaign_id: campaign.id,
      template_id: email1.id,
      recipient_email: normalizedEmail,
      subject: rendered.subject,
      status: sendRes.success ? "sent" : "failed",
      provider: this.provider.name,
      message_id: sendRes.messageId || null,
      error_message: sendRes.error || null,
      sent_at: sendRes.success ? new Date().toISOString() : null,
      scheduled_at: new Date().toISOString(),
    });

    // 6. Schedule Email 2 in user_email_campaigns (Day 4)
    const nextSendDate = email2
      ? EmailScheduler.calculateNextSendDate(email2.delay_value, email2.delay_unit)
      : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    await supabaseAdmin.from("user_email_campaigns").upsert(
      {
        user_id: waitlistUserId,
        audience_type: "waitlist",
        campaign_id: campaign.id,
        current_template_id: email1.id,
        status: "active",
        started_at: new Date().toISOString(),
        last_sent_at: new Date().toISOString(),
        next_send_at: nextSendDate.toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,campaign_id" }
    );
  }
}