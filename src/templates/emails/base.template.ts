export interface BaseTemplateProps {
  heading?: string;
  bodyContent: string;
  ctaText?: string;
  ctaUrl?: string;
  unsubscribeUrl: string;
  companyName: string;
  productName: string;
}

export function renderBaseHtmlLayout(props: BaseTemplateProps): string {
  const ctaButtonHtml = props.ctaText && props.ctaUrl
    ? `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
        <tr>
          <td align="center" style="border-radius: 6px; background-color: #111827;">
            <a href="${props.ctaUrl}" target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; letter-spacing: 0.2px;">
              ${props.ctaText}
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${props.heading || props.productName}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; }
    .header { padding: 32px 32px 16px 32px; border-bottom: 1px solid #f3f4f6; }
    .content { padding: 32px; font-size: 15px; line-height: 1.6; color: #374151; }
    .footer { padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center; }
    .footer a { color: #6b7280; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">${props.productName}</h3>
    </div>
    <div class="content">
      ${props.bodyContent}
      ${ctaButtonHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;">You received this email because you signed up on our platform.</p>
      <p style="margin: 0;">
        <a href="${props.unsubscribeUrl}">Unsubscribe</a> &bull; &copy; ${new Date().getFullYear()} ${props.companyName}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}