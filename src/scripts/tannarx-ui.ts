import { computeChain, totalStructure, type Stage } from './tannarx';

interface Labels {
  stageLabel: string;
  inputCostLabel: string;
  inputCostAutoLabel: string;
  structureLabels: {
    material: string;
    labor: string;
    depreciation: string;
    energy: string;
    overhead: string;
  };
}

const numberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

function fmt(n: number): string {
  return `${numberFormat.format(Math.round(n))} сум`;
}

export function initTannarxCalculator(root: HTMLElement, labels: Labels) {
  const stagesContainer = root.querySelector<HTMLElement>('[data-stages]')!;
  const template = root.querySelector<HTMLTemplateElement>('[data-stage-template]')!;
  const addBtn = root.querySelector<HTMLButtonElement>('[data-add-stage]')!;
  const finalResultEl = root.querySelector<HTMLElement>('[data-final-result]')!;
  const structureEl = root.querySelector<HTMLElement>('[data-structure]')!;

  function addStage() {
    const clone = template.content.cloneNode(true) as DocumentFragment;
    stagesContainer.appendChild(clone);
    render();
    recalculate();
  }

  function removeStage(card: HTMLElement) {
    card.remove();
    render();
    recalculate();
  }

  function render() {
    const cards = Array.from(stagesContainer.querySelectorAll<HTMLElement>('[data-stage-card]'));
    cards.forEach((card, i) => {
      const title = card.querySelector<HTMLElement>('[data-stage-title]')!;
      title.textContent = `${labels.stageLabel} ${i + 1}`;

      const inputCostWrap = card.querySelector<HTMLElement>('[data-input-cost-wrap]')!;
      const inputCostLabelEl = card.querySelector<HTMLElement>('[data-input-cost-label]')!;
      const inputCostField = card.querySelector<HTMLInputElement>('[data-field="inputCost"]')!;

      if (i === 0) {
        inputCostLabelEl.textContent = labels.inputCostLabel;
        inputCostField.disabled = false;
        inputCostWrap.classList.remove('opacity-60');
      } else {
        inputCostLabelEl.textContent = labels.inputCostAutoLabel;
        inputCostField.disabled = true;
        inputCostWrap.classList.add('opacity-60');
      }
    });
  }

  function readStages(): Stage[] {
    const cards = Array.from(stagesContainer.querySelectorAll<HTMLElement>('[data-stage-card]'));
    return cards.map((card) => {
      const get = (field: string) => {
        const input = card.querySelector<HTMLInputElement>(`[data-field="${field}"]`);
        return input ? Number(input.value) || 0 : 0;
      };
      return {
        inputCost: get('inputCost'),
        wasteNorm: get('wasteNorm'),
        laborCost: get('laborCost'),
        depreciation: get('depreciation'),
        energy: get('energy'),
        overhead: get('overhead'),
      };
    });
  }

  function recalculate() {
    const stages = readStages();
    if (stages.length === 0) {
      finalResultEl.textContent = fmt(0);
      structureEl.innerHTML = '';
      return;
    }
    const results = computeChain(stages);

    const cards = Array.from(stagesContainer.querySelectorAll<HTMLElement>('[data-stage-card]'));
    cards.forEach((card, i) => {
      const out = card.querySelector<HTMLElement>('[data-stage-output]')!;
      out.textContent = fmt(results[i].outputCost);
    });

    const final = results[results.length - 1].outputCost;
    finalResultEl.textContent = fmt(final);

    const structure = totalStructure(results);
    const total =
      structure.materialCost + structure.laborCost + structure.depreciation + structure.energy + structure.overheadCost;

    const rows = [
      { label: labels.structureLabels.material, value: structure.materialCost, color: 'bg-ledger' },
      { label: labels.structureLabels.labor, value: structure.laborCost, color: 'bg-ink' },
      { label: labels.structureLabels.depreciation, value: structure.depreciation, color: 'bg-muted' },
      { label: labels.structureLabels.energy, value: structure.energy, color: 'bg-flag' },
      { label: labels.structureLabels.overhead, value: structure.overheadCost, color: 'bg-rule' },
    ];

    structureEl.innerHTML = rows
      .map((row) => {
        const pct = total > 0 ? (row.value / total) * 100 : 0;
        return `
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span>${row.label}</span>
              <span class="font-nums">${fmt(row.value)}</span>
            </div>
            <div class="h-2 bg-rule/40 overflow-hidden">
              <div class="h-full ${row.color}" style="width:${pct.toFixed(1)}%"></div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  root.addEventListener('input', (e) => {
    if ((e.target as HTMLElement).matches('input')) recalculate();
  });

  stagesContainer.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-remove-stage]');
    if (btn) {
      const card = btn.closest<HTMLElement>('[data-stage-card]');
      if (card) removeStage(card);
    }
  });

  addBtn.addEventListener('click', addStage);

  addStage();
  addStage();
}
