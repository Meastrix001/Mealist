const VULGAR: Record<string, number> = {
  '⅛': 1 / 8, '¼': 1 / 4, '⅓': 1 / 3, '⅜': 3 / 8,
  '½': 1 / 2, '⅝': 5 / 8, '⅔': 2 / 3, '¾': 3 / 4, '⅞': 7 / 8,
};

const FRACTION_DISPLAY: [number, string][] = [
  [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'],
  [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'],
];

// Canonical unit keys (all lowercase in regex, resolved to canonical form)
const UNIT_ALIAS: Record<string, string> = {
  'tsp': 'tsp', 'teaspoon': 'tsp', 'teaspoons': 'tsp',
  'tbsp': 'tbsp', 'tablespoon': 'tbsp', 'tablespoons': 'tbsp',
  'cup': 'cup', 'cups': 'cup',
  'fl oz': 'fl oz', 'fluid ounce': 'fl oz', 'fluid ounces': 'fl oz',
  'oz': 'oz', 'ounce': 'oz', 'ounces': 'oz',
  'lb': 'lb', 'lbs': 'lb', 'pound': 'lb', 'pounds': 'lb',
  'g': 'g', 'gram': 'g', 'grams': 'g',
  'kg': 'kg', 'kilogram': 'kg', 'kilograms': 'kg',
  'ml': 'ml', 'milliliter': 'ml', 'milliliters': 'ml', 'millilitre': 'ml', 'millilitres': 'ml',
  'l': 'L', 'liter': 'L', 'liters': 'L', 'litre': 'L', 'litres': 'L',
};

// Sorted longest-first so "fl oz" matches before "oz"
const UNIT_KEYS = Object.keys(UNIT_ALIAS).sort((a, b) => b.length - a.length);

const TO_ML: Record<string, number> = {
  tsp: 4.929, tbsp: 14.787, cup: 236.588, 'fl oz': 29.574, ml: 1, L: 1000,
};

const TO_G: Record<string, number> = {
  oz: 28.35, lb: 453.592, g: 1, kg: 1000,
};

interface Parsed {
  value: number | null;
  unit: string | null;
  suffix: string;
}

function parseNumericPrefix(s: string): { value: number; consumed: number } | null {
  // "2 1/2" or "2 ½"
  const mixed = s.match(/^(\d+)\s+(\d+\/\d+|[⅛¼⅓⅜½⅝⅔¾⅞])/);
  if (mixed) {
    const whole = parseInt(mixed[1]);
    const fracStr = mixed[2];
    const frac = VULGAR[fracStr] ?? (() => {
      const [n, d] = fracStr.split('/');
      return parseInt(n) / parseInt(d);
    })();
    return { value: whole + frac, consumed: mixed[0].length };
  }
  // "½" or "1/2"
  const frac = s.match(/^([⅛¼⅓⅜½⅝⅔¾⅞]|\d+\/\d+)/);
  if (frac) {
    const fs = frac[1];
    const val = VULGAR[fs] ?? (() => {
      const [n, d] = fs.split('/');
      return parseInt(n) / parseInt(d);
    })();
    return { value: val, consumed: frac[0].length };
  }
  // plain integer or decimal
  const num = s.match(/^(\d+\.?\d*)/);
  if (num) return { value: parseFloat(num[1]), consumed: num[0].length };
  return null;
}

function parseAmount(amount: string): Parsed {
  const s = amount.trim();
  const numResult = parseNumericPrefix(s);
  if (!numResult) return { value: null, unit: null, suffix: s };

  const rest = s.slice(numResult.consumed).trim();

  for (const key of UNIT_KEYS) {
    const re = new RegExp(`^${key.replace(/\s+/, '\\s+')}(?=\\s|$)`, 'i');
    const m = rest.match(re);
    if (m) {
      return {
        value: numResult.value,
        unit: UNIT_ALIAS[key.toLowerCase()],
        suffix: rest.slice(m[0].length).trim(),
      };
    }
  }

  return { value: numResult.value, unit: null, suffix: rest };
}

function formatNum(n: number): string {
  const whole = Math.floor(n);
  const frac = n - whole;
  const TOL = 0.04;
  let fracSym = '';
  for (const [val, sym] of FRACTION_DISPLAY) {
    if (Math.abs(frac - val) < TOL) { fracSym = sym; break; }
  }
  if (!fracSym && frac > TOL) return n.toFixed(1).replace(/\.0$/, '');
  if (whole === 0) return fracSym || '0';
  return fracSym ? `${whole}${fracSym}` : String(whole);
}

function metricVolume(ml: number): string {
  if (ml >= 900) return `${(Math.round(ml / 100) / 10).toFixed(1).replace(/\.0$/, '')} L`;
  if (ml >= 100) return `${Math.round(ml / 10) * 10} ml`;
  if (ml >= 20) return `${Math.round(ml / 5) * 5} ml`;
  return `${Math.round(ml)} ml`;
}

function metricWeight(g: number): string {
  if (g >= 900) return `${(Math.round(g / 100) / 10).toFixed(1).replace(/\.0$/, '')} kg`;
  if (g >= 100) return `${Math.round(g / 10) * 10} g`;
  return `${Math.round(g)} g`;
}

export function formatAmount(
  original: string,
  scaleFactor: number,
  metric: boolean,
): string {
  const { value, unit, suffix } = parseAmount(original);
  if (value === null) return original;

  const scaled = value * scaleFactor;
  const parts: string[] = [];

  if (metric && unit && TO_ML[unit] !== undefined) {
    parts.push(metricVolume(scaled * TO_ML[unit]));
  } else if (metric && unit && TO_G[unit] !== undefined) {
    parts.push(metricWeight(scaled * TO_G[unit]));
  } else {
    parts.push(formatNum(scaled));
    if (unit) parts.push(unit);
  }

  if (suffix) parts.push(suffix);
  return parts.join(' ');
}
