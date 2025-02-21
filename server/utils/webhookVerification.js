import crypto from 'crypto';

export const verifyWebhookSignature = (payload, signature) => {
  const secret = useRuntimeConfig().webhookSecret;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}; 