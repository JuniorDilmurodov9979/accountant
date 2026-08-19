export interface TaxRates {
  turnoverTax: { rate: number };
  vat: { rate: number };
  profitTax: { rate: number };
}

export interface SoliqInput {
  turnover: number;
  expenseVatShare: number; // %
  employees: number;
}

export function computeTurnoverRegime(input: SoliqInput, rates: TaxRates) {
  const tax = input.turnover * (rates.turnoverTax.rate / 100);
  return { tax, effectiveRate: input.turnover > 0 ? (tax / input.turnover) * 100 : 0 };
}

export function computeGeneralRegime(input: SoliqInput, rates: TaxRates) {
  // Very simplified model: VAT payable = output VAT - input VAT (on the share of expenses with deductible VAT).
  // Profit tax is estimated on an assumed margin — this is illustrative only, per BRIEF.md disclaimer requirement.
  const assumedMargin = 0.2;
  const outputVat = input.turnover * (rates.vat.rate / 100);
  const deductibleExpenses = input.turnover * (1 - assumedMargin) * (input.expenseVatShare / 100);
  const inputVat = deductibleExpenses * (rates.vat.rate / 100);
  const vatPayable = Math.max(outputVat - inputVat, 0);

  const profitBase = input.turnover * assumedMargin;
  const profitTax = profitBase * (rates.profitTax.rate / 100);

  const tax = vatPayable + profitTax;
  return { tax, vatPayable, profitTax, effectiveRate: input.turnover > 0 ? (tax / input.turnover) * 100 : 0 };
}
