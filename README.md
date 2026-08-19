# Сайт — бухгалтерские услуги (Навои)

Простое руководство для тех, кто не пишет код.

## Что это за сайт

Лендинг + 3 калькулятора + форма заявки, которая уходит прямо в Telegram.
Два языка: русский (по умолчанию, `/`) и узбекский (`/uz/`).

## Как редактировать тексты

Все тексты сайта лежат в двух файлах:

- `src/i18n/ru.ts` — русский текст
- `src/i18n/uz.ts` — узбекский текст

Открываете файл, находите нужную строчку в кавычках, меняете текст, сохраняете.
Код трогать не нужно — только текст внутри кавычек `'...'`.

## Как отредактировать услуги (6 карточек)

Файлы в папке `src/content/services/` — каждая услуга в своём `.json` файле
(`01-outsourcing.json`, `02-sebestoimost.json` и т.д.). Внутри — заголовок,
описание и цена на русском и узбекском. Цены сейчас ориентировочные — их
нужно подтвердить и поправить перед публикацией.

## Как ответить на вопросы FAQ

Файлы в `src/content/faq/01.json` … `08.json`. Поле `"answer"` сейчас
содержит `"TODO_FAQ"` — замените на реальный ответ на русском и узбекском,
и поменяйте `"isTodo": true` на `"isTodo": false`.

## Налоговые ставки

Файл `src/data/tax-rates.json`. Сейчас там `"TODO_RATE"` — калькуляторы
специально не считают реальные суммы, пока ставки не подтверждены. После
того как вы впишете актуальные проценты, калькуляторы заработают сразу.

## Фото и картинки

- `public/photo-placeholder.svg` — замените на реальное фото (можно оставить
  любое имя файла, главное поправить путь в `src/components/About.astro`).
- `public/og-placeholder.svg` — картинка, которая показывается при пересылке
  ссылки в мессенджерах. Нужны 2 картинки 1200×630 (ru/uz), пути указаны в
  `src/layouts/BaseLayout.astro`.

## Telegram-бот для заявок

1. Напишите @BotFather в Telegram, создайте бота, скопируйте токен.
2. Узнайте свой chat ID через @userinfobot.
3. Локально: скопируйте `.env.example` в `.env` и впишите значения.
4. На Cloudflare Pages: в настройках проекта → Environment variables
   добавьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.

## Запуск локально

```bash
npm install
npm run dev
```

Откроется на `http://localhost:4321`.

## Деплой на Cloudflare Pages

```bash
npm run build
```

Собранный сайт — в папке `dist/`. Подключите репозиторий к Cloudflare Pages
(build command: `npm run build`, output directory: `dist`), не забудьте
добавить переменные окружения из `.env.example` в настройках проекта.

## Список TODO перед запуском

- `TODO_DOMAIN` (astro.config.mjs, public/robots.txt) — вписать реальный домен
- `TODO_TELEGRAM` (src/data/site.ts) — Telegram username для кнопок на сайте
- `TODO_RATE`, `TODO_DATE`, `TODO_VALUE` (src/data/tax-rates.json) — актуальные налоговые ставки
- `TODO_FAQ` (src/content/faq/*.json) — ответы на 8 вопросов
- `TODO_PHOTO` (public/photo-placeholder.svg) — реальное фото специалиста
- `TODO_OG` (public/og-placeholder.svg) — OG-картинки 1200×630 для ru и uz
- `TODO_ANALYTICS` / `TODO_METRIKA_ID` (src/layouts/BaseLayout.astro) — счётчик Яндекс.Метрики
- `TODO_KV` (wrangler.toml) — KV namespace для рейт-лимита формы (опционально)
- Цены в `src/content/services/*.json` — подтвердить перед публикацией
