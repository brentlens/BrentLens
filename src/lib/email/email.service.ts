
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

    // BATCH 1: Run non-dependent reads & pre-writes in parallel
    const [campaignRes, waitlistRecordRes, memberCountRes] = await Promise.all([
      // A. Fetch campaign
      supabaseAdmin
        .from("email_campaigns")
        .select("id")
        .eq("slug", "pre-reg-subscribed")
        .eq("status", "active")
        .maybeSingle(),

      // B. Check if previously on waitlist
      supabaseAdmin
        .from("brent_waitlistUsers")
        .select("id")
        .ilike("user_email", normalizedEmail)
        .maybeSingle(),

      // C. Count total subscribed users for member number
      supabaseAdmin
        .from("users_profile")
        .select("id", { count: "exact", head: true }),

      // D. Fire & forget preference creation
      supabaseAdmin
        .from("email_preferences")
        .upsert(
          { email: normalizedEmail, marketing_emails: true, updated_at: new Date().toISOString() },
          { onConflict: "email" }
        ),
    ]);

    const campaign = campaignRes.data;
    if (!campaign) {
      console.error('[EMAIL_ERROR] Campaign "pre-reg-subscribed" not found or inactive.');
      return;
    }

    const memberNumber = memberCountRes.count || 1;

    // Clean up waitlist campaigns in parallel if migrating
    if (waitlistRecordRes.data?.id) {
      const waitlistId = waitlistRecordRes.data.id;
      Promise.all([
        supabaseAdmin
          .from("user_email_campaigns")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", waitlistId)
          .eq("audience_type", "waitlist"),
        supabaseAdmin
          .from("brent_waitlistUsers")
          .update({ isRegistered: true, status: "migrated" })
          .eq("id", waitlistId),
      ]).catch((err) => console.error("[WAITLIST_CLEANUP_ERROR]", err));
    }

    // BATCH 2: Fetch sequence templates
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

    // BATCH 3: Render and Send Email 1
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

    // BATCH 4: Parallelize Delivery Log and Next Send Schedule
    const nextSendDate = email2
      ? EmailScheduler.calculateNextSendDate(email2.delay_value, email2.delay_unit)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await Promise.all([
      supabaseAdmin.from("email_delivery_logs").insert({
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
      }),
      supabaseAdmin.from("user_email_campaigns").upsert(
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
      ),
    ]);
  }

  // ==========================================================================
  // 2. OPTIMIZED FREE WAITLIST USER ONBOARDING
  // ==========================================================================
  public static async handleWaitlistUserOnboarding(params: {
    waitlistUserId: string;
    email: string;
    name?: string;
  }): Promise<void> {
    const { waitlistUserId, email, name } = params;
    const normalizedEmail = email.trim().toLowerCase();
    const firstName = name?.trim() ? name.trim().split(" ")[0] : "there";
    const campaignId = "9ec594a4-b1c0-4416-b262-76d45f39e517";

    // BATCH 1: Fetch campaign and templates + Upsert preferences in parallel
    const [templatesRes] = await Promise.all([
      supabaseAdmin
        .from("email_templates")
        .select("*")
        .eq("campaign_id", campaignId)
        .in("sequence_order", [1, 2])
        .order("sequence_order", { ascending: true }),

      supabaseAdmin
        .from("email_preferences")
        .upsert(
          { email: normalizedEmail, marketing_emails: true, updated_at: new Date().toISOString() },
          { onConflict: "email" }
        ),
    ]);

    const templates = templatesRes.data;
    const email1 = templates?.find((t) => t.sequence_order === 1);
    const email2 = templates?.find((t) => t.sequence_order === 2);

    if (!email1) {
      console.error("[EMAIL_ERROR] Sequence 1 template missing for waitlist campaign.");
      return;
    }

    // BATCH 2: Render & Send Email 1
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

    // BATCH 3: Parallelize Log insertion & Campaign enrollment
    const nextSendDate = email2
      ? EmailScheduler.calculateNextSendDate(email2.delay_value, email2.delay_unit)
      : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    await Promise.all([
      supabaseAdmin.from("email_delivery_logs").insert({
        user_id: waitlistUserId,
        audience_type: "waitlist",
        campaign_id: campaignId,
        template_id: email1.id,
        recipient_email: normalizedEmail,
        subject: rendered.subject,
        status: sendRes.success ? "sent" : "failed",
        provider: this.provider.name,
        message_id: sendRes.messageId || null,
        error_message: sendRes.error || null,
        sent_at: sendRes.success ? new Date().toISOString() : null,
        scheduled_at: new Date().toISOString(),
      }),
      supabaseAdmin.from("user_email_campaigns").upsert(
        {
          user_id: waitlistUserId,
          audience_type: "waitlist",
          campaign_id: campaignId,
          current_template_id: email1.id,
          status: "active",
          started_at: new Date().toISOString(),
          last_sent_at: new Date().toISOString(),
          next_send_at: nextSendDate.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,campaign_id" }
      ),
    ]);
  }
}