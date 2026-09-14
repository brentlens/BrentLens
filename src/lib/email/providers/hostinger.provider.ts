/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer, { Transporter } from 'nodemailer';
import { EmailProvider } from './email.provider.interface';
import { SendEmailOptions, SendEmailResult } from '@/types/email';
import { EMAIL_CONFIG } from '@/config/email.config';

export class HostingerSmtpProvider implements EmailProvider {
  public readonly name = 'hostinger';
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.smtp.host,
      port: EMAIL_CONFIG.smtp.port,
      secure: EMAIL_CONFIG.smtp.secure,
      auth: {
        user: EMAIL_CONFIG.smtp.user,
        pass: EMAIL_CONFIG.smtp.password,
      },
      tls: {
        rejectUnauthorized: true,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const fromFormatted = `"${options.fromName || EMAIL_CONFIG.smtp.fromName}" <${EMAIL_CONFIG.smtp.fromEmail}>`;
      const info = await this.transporter.sendMail({
        from: fromFormatted,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo || EMAIL_CONFIG.smtp.fromEmail,
        headers: options.headers,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Hostinger SMTP send failure',
      };
    }
  }

  async verifyConnection(): Promise<{ healthy: boolean; error?: string }> {
    try {
      await this.transporter.verify();
      return { healthy: true };
    } catch (err: any) {
      return { healthy: false, error: err?.message || 'SMTP verification failed' };
    }
  }
}