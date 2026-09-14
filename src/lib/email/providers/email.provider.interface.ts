import { SendEmailOptions, SendEmailResult } from '@/types/email';

export interface EmailProvider {
  name: string;
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
  verifyConnection(): Promise<{ healthy: boolean; error?: string }>;
}