export type AudienceType = 'waitlist' | 'subscribed' | 'all';
export type CampaignMode = 'sequential' | 'random';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type DelayUnit = 'minutes' | 'hours' | 'days';
export type DeliveryStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'skipped';
export type UserCampaignStatus = 'active' | 'paused' | 'completed' | 'unsubscribed';

export interface EmailCampaign {
  id: string;
  name: string;
  slug: string;
  description?: string;
  audience_type: AudienceType;
  mode: CampaignMode;
  status: CampaignStatus;
  restart_after_completion: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  campaign_id: string;
  name: string;
  slug: string;
  subject: string;
  preheader?: string;
  html_content: string;
  text_content?: string;
  cta_text?: string;
  cta_url?: string;
  delay_value: number;
  delay_unit: DelayUnit;
  sequence_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailRecipient {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customVariables?: Record<string, string>;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface BulkSendResult {
  success: boolean;
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
  errors?: Array<{ recipient: string; error: string }>;
}