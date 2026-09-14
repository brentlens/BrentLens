export const EMAIL_CONFIG = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE !== 'false', // 465 is true, 587 is false
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromEmail: process.env.EMAIL_FROM || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Notification System',
  },
  app: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
    companyName: process.env.COMPANY_NAME || 'Your Company Inc.',
    productName: process.env.PRODUCT_NAME || 'Your Product',
    cronSecret: process.env.EMAIL_CRON_SECRET || process.env.CRON_SECRET || '',
    batchSize: parseInt(process.env.EMAIL_BATCH_SIZE || '50', 10),
    maxRetries: 3,
  },
  supportedVariables: [
    'first_name',
    'last_name',
    'email',
    'product_name',
    'product_url',
    'unsubscribe_url',
    'company_name',
    'launch_date',
    'cta_url',
    'cta_text',
  ] as const,
};