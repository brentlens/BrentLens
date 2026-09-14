import crypto from 'crypto';
import { EMAIL_CONFIG } from '@/config/email.config';
import { renderBaseHtmlLayout } from '@/templates/emails/base.template';

export class EmailTemplateEngine {
  /**
   * Generates a safe, tamper-resistant unsubscribe URL
   */
  public static generateUnsubscribeUrl(userId: string, email: string): string {
    const secret = EMAIL_CONFIG.app.cronSecret || 'default_secret';
    const hash = crypto.createHmac('sha256', secret).update(`${userId}:${email}`).digest('hex');
    const token = Buffer.from(JSON.stringify({ u: userId, e: email, h: hash })).toString('base64url');
    return `${EMAIL_CONFIG.app.siteUrl}/api/email/unsubscribe?token=${token}`;
  }

  /**
   * Verifies if a tokenized unsubscribe link matches parameters
   */
  public static verifyUnsubscribeToken(token: string): { valid: boolean; userId?: string } {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
      const secret = EMAIL_CONFIG.app.cronSecret || 'default_secret';
      const expectedHash = crypto.createHmac('sha256', secret).update(`${decoded.u}:${decoded.e}`).digest('hex');

      if (expectedHash === decoded.h) {
        return { valid: true, userId: decoded.u };
      }
      return { valid: false };
    } catch {
      return { valid: false };
    }
  }

  /**
   * Safe placeholder replacement preventing code execution
   */
  public static interpolate(content: string, variables: Record<string, string>): string {
    return content.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
      return variables[key] !== undefined ? variables[key] : '';
    });
  }

  /**
   * Compiles template body and wraps it inside the standard Base HTML
   */
  public static renderTemplate(params: {
    rawHtml: string;
    rawText?: string;
    subject: string;
    ctaText?: string;
    ctaUrl?: string;
    variables: Record<string, string>;
    userId: string;
    recipientEmail: string;
  }): { subject: string; html: string; text: string } {
    const unsubscribeUrl = this.generateUnsubscribeUrl(params.userId, params.recipientEmail);

    const mergedVariables: Record<string, string> = {
      product_name: EMAIL_CONFIG.app.productName,
      product_url: EMAIL_CONFIG.app.siteUrl,
      company_name: EMAIL_CONFIG.app.companyName,
      unsubscribe_url: unsubscribeUrl,
      cta_text: params.ctaText ? this.interpolate(params.ctaText, params.variables) : '',
      cta_url: params.ctaUrl ? this.interpolate(params.ctaUrl, params.variables) : '',
      ...params.variables,
    };

    const parsedSubject = this.interpolate(params.subject, mergedVariables);
    const parsedBody = this.interpolate(params.rawHtml, mergedVariables);
    const parsedCtaUrl = mergedVariables.product_url + mergedVariables.cta_url;
    const parsedCtaText = mergedVariables.cta_text;

    const finalHtml = renderBaseHtmlLayout({
      heading: parsedSubject,
      bodyContent: parsedBody,
      ctaText: parsedCtaText,
      ctaUrl: parsedCtaUrl,
      unsubscribeUrl,
      companyName: EMAIL_CONFIG.app.companyName,
      productName: EMAIL_CONFIG.app.productName,
    });

    const plainFallback = params.rawText
      ? this.interpolate(params.rawText, mergedVariables)
      : parsedBody.replace(/<[^>]*>?/gm, '');

    return {
      subject: parsedSubject,
      html: finalHtml,
      text: `${plainFallback}\n\nUnsubscribe: ${unsubscribeUrl}`,
    };
  }
}