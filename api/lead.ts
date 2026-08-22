export const config = { runtime: 'edge' };

interface LeadPayload {
  name?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  page?: string;
  src?: string;
  website?: string; // honeypot
}

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

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405 });
  }

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
  const src = (payload.src ?? 'direct').trim().slice(0, 100);

  if (!name || !phone || !isValidPhone(phone)) {
    return new Response(JSON.stringify({ error: 'validation_failed' }), { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500 });
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
    `Источник: ${escapeHtml(src)}`,
    `Время: ${tashkentTime} (Ташкент)`,
  ].filter(Boolean);

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const telegramResponse = await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
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
}
