export interface WageRates {
  incomeTax: { rate: number };
  inps: { rate: number };
  socialTax: { rate: number };
}

export type Direction = 'net' | 'gross' | 'full';

export function fromGross(gross: number, rates: WageRates) {
  const inps = gross * (rates.inps.rate / 100);
  const incomeTax = (gross - inps) * (rates.incomeTax.rate / 100);
  const net = gross - inps - incomeTax;
  const socialTax = gross * (rates.socialTax.rate / 100);
  const fullCost = gross + socialTax;
  return { gross, net, inps, incomeTax, socialTax, fullCost };
}

export function fromNet(net: number, rates: WageRates) {
  // Solve gross iteratively since incomeTax base depends on inps(gross).
  let gross = net;
  for (let i = 0; i < 30; i++) {
    const result = fromGross(gross, rates);
    const diff = net - result.net;
    if (Math.abs(diff) < 0.5) break;
    gross += diff;
  }
  return fromGross(gross, rates);
}

export function fromFullCost(fullCost: number, rates: WageRates) {
  const gross = fullCost / (1 + rates.socialTax.rate / 100);
  return fromGross(gross, rates);
}
