export const company = {
  legalName: 'TODO_MCHJ_FULL_LEGAL_NAME', // yuridik shaxsning ro'yxatdan o'tgan to'liq nomi
  brandName: 'TODO_BRAND_NAME', // nav/logo'da ko'rinadigan qisqa nom
  inn: 'TODO_INN', // STIR — footer'da ko'rsatiladi
  since: 1998, // asoschining buxgalteriyadagi birinchi yili
  chiefAccountantSince: 2009, // birinchi bosh buxgalter lavozimi
  teamSize: 4, // hozirgi jamoa soni, asoschi bilan
  maxConcurrentClients: 6, // real sig'im chegarasi
  slotsOpen: null as number | null, // TODO_SLOTS: mijoz yangilab turadigan bo'sh joylar soni, agar yuritilmasa null qoldiring
  phone: '+998 94 253-77-97',
  phoneHref: 'tel:+998942537797',
  telegram: 'TODO_TELEGRAM', // Telegram username, @ belgisisiz
  telegramHref: 'https://t.me/TODO_TELEGRAM',
  telegramBot: 'TODO_BOT_USERNAME',
  city: { ru: 'Навои', uz: 'Navoiy' },
} as const;

export function yearsSince(startYear: number, atYear: number): number {
  return atYear - startYear;
}
