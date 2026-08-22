import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const INK = '#12181D';
const PAPER = '#FBFAF7';
const RULE = '#DCDDD6';
const LEDGER = '#1E5240';

function svg({ brand, tagline, phone }) {
  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${PAPER}" />
  <rect x="0" y="0" width="1200" height="630" fill="none" stroke="${RULE}" stroke-width="2" />
  <rect x="80" y="80" width="10" height="470" fill="${LEDGER}" />
  <text x="140" y="230" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="64" fill="${INK}">${brand}</text>
  <text x="140" y="300" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="34" fill="${INK}">${tagline}</text>
  <line x1="140" y1="360" x2="1080" y2="360" stroke="${RULE}" stroke-width="2" />
  <text x="140" y="430" font-family="'Courier New', monospace" font-weight="500" font-size="40" fill="${LEDGER}">${phone}</text>
</svg>`;
}

mkdirSync('public', { recursive: true });

const variants = [
  {
    file: 'public/og-ru.png',
    brand: 'TODO_BRAND_NAME',
    tagline: 'Бухгалтерия производственных предприятий',
    phone: '+998 94 253-77-97',
  },
  {
    file: 'public/og-uz.png',
    brand: 'TODO_BRAND_NAME',
    tagline: 'Ishlab chiqarish korxonalari buxgalteriyasi',
    phone: '+998 94 253-77-97',
  },
];

for (const v of variants) {
  await sharp(Buffer.from(svg(v))).png().toFile(v.file);
  console.log('wrote', v.file);
}
