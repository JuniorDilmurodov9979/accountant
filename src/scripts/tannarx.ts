export interface Stage {
  inputCost: number; // sum per unit — ignored for stages after the first (chained)
  wasteNorm: number; // %
  laborCost: number;
  depreciation: number;
  energy: number;
  overhead: number; // %
}

export interface StageResult {
  materialCost: number;
  laborCost: number;
  depreciation: number;
  energy: number;
  overheadCost: number;
  outputCost: number;
}

export function computeStage(stage: Stage, inputFromPrevious: number | null): StageResult {
  const rawInput = inputFromPrevious ?? stage.inputCost;
  const waste = Math.min(Math.max(stage.wasteNorm, 0), 95) / 100;
  const materialCost = waste < 1 ? rawInput / (1 - waste) : rawInput;
  const direct = materialCost + stage.laborCost + stage.depreciation + stage.energy;
  const overheadCost = direct * (stage.overhead / 100);
  const outputCost = direct + overheadCost;

  return {
    materialCost,
    laborCost: stage.laborCost,
    depreciation: stage.depreciation,
    energy: stage.energy,
    overheadCost,
    outputCost,
  };
}

export function computeChain(stages: Stage[]): StageResult[] {
  const results: StageResult[] = [];
  let prevOutput: number | null = null;
  for (const stage of stages) {
    const result = computeStage(stage, prevOutput);
    results.push(result);
    prevOutput = result.outputCost;
  }
  return results;
}

export function totalStructure(results: StageResult[]) {
  return results.reduce(
    (acc, r) => ({
      materialCost: acc.materialCost + r.materialCost,
      laborCost: acc.laborCost + r.laborCost,
      depreciation: acc.depreciation + r.depreciation,
      energy: acc.energy + r.energy,
      overheadCost: acc.overheadCost + r.overheadCost,
    }),
    { materialCost: 0, laborCost: 0, depreciation: 0, energy: 0, overheadCost: 0 }
  );
}
