/// <reference types="@cloudflare/workers-types" />

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  LEAD_RATE_LIMIT?: KVNamespace;
}

interface LeadPayload {
  name?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  page?: string;
  website?: string; // honeypot
}

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 3;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }

  // Honeypot: bots fill hidden fields, real users never see this field.
  if (payload.website) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const name = (payload.name ?? '').trim().slice(0, 200);
  const phone = (payload.phone ?? '').trim().slice(0, 50);
  const company = (payload.company ?? '').trim().slice(0, 200);
  const service = (payload.service ?? '').trim().slice(0, 200);
  const message = (payload.message ?? '').trim().slice(0, 1000);
  const page = (payload.page ?? '').trim().slice(0, 300);

  if (!name || !phone || !isValidPhone(phone)) {
    return new Response(JSON.stringify({ error: 'validation_failed' }), { status: 400 });
  }

  if (env.LEAD_RATE_LIMIT) {
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const key = `lead:${ip}`;
    const current = Number((await env.LEAD_RATE_LIMIT.get(key)) ?? '0');
    if (current >= RATE_LIMIT_MAX_REQUESTS) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 });
    }
    await env.LEAD_RATE_LIMIT.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  }

  const tashkentTime = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Tashkent',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const lines = [
    '🔔 Новая заявка — сайт',
    '',
    `Имя: ${escapeHtml(name)}`,
    `Телефон: ${escapeHtml(phone)}`,
    company ? `Компания: ${escapeHtml(company)}` : null,
    service ? `Услуга: ${escapeHtml(service)}` : null,
    message ? `Комментарий: ${escapeHtml(message)}` : null,
    '',
    page ? `Страница: ${escapeHtml(page)}` : null,
    `Время: ${tashkentTime} (Ташкент)`,
  ].filter(Boolean);

  const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const telegramResponse = await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: lines.join('\n'),
      parse_mode: 'HTML',
    }),
  });

  if (!telegramResponse.ok) {
    return new Response(JSON.stringify({ error: 'telegram_failed' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
