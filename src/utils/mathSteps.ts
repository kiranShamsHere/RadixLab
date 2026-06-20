/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Highly modular conversion step-by-step solver engine for RadixLab
// Computes real mathematical terms, quotients, quotients table, remainders list & fractional factors dynamic formulas.

export interface StepResults {
  fromBase: number;
  toBase: number;
  input: string;
  hasFractional: boolean;
  toDecimalFormula: string;
  toDecimalSummed: string;
  decimalValue: number;
  divisionSteps: {
    dividend: number;
    divisor: number;
    quotient: number;
    remainder: number;
    remainderChar: string;
  }[];
  multiplicationSteps: {
    fractional: number;
    multiplier: number;
    product: number;
    digit: number;
    remaining: number;
  }[];
}

export function generateConversionSteps(input: string, fromBase: number, toBase: number): StepResults | null {
  if (!input || isNaN(fromBase) || isNaN(toBase)) return null;

  const cleanInput = input.trim().toUpperCase();
  const parts = cleanInput.split('.');
  const intStr = parts[0] || '0';
  const fracStr = parts[1] || '';
  const hasFractional = parts.length > 1 && fracStr.length > 0;

  // 1. Calculate to intermediate base 10 (decimal) value
  // Integer part decimal calculation: sum(d_i * base^i)
  let decimalInt = 0;
  const terms: string[] = [];
  const mathTerms: string[] = [];

  for (let i = 0; i < intStr.length; i++) {
    const char = intStr[i];
    const val = parseInt(char, fromBase);
    if (isNaN(val)) continue;
    const power = intStr.length - 1 - i;
    decimalInt += val * Math.pow(fromBase, power);

    // Formatted strings
    const basePowerStr = power === 0 ? '1' : `${fromBase}^${power}`;
    terms.push(`(${char} × ${fromBase}${toSubscript(power)})`);
    mathTerms.push(`(${val} × ${Math.pow(fromBase, power)})`);
  }

  // Fractional part decimal calculation: sum(d_j * base^-j)
  let decimalFrac = 0;
  const fracTerms: string[] = [];
  const fracMathTerms: string[] = [];
  
  if (hasFractional) {
    for (let j = 0; j < fracStr.length; j++) {
      const char = fracStr[j];
      const val = parseInt(char, fromBase);
      if (isNaN(val)) continue;
      const power = -(j + 1);
      decimalFrac += val * Math.pow(fromBase, power);

      fracTerms.push(`(${char} × ${fromBase}${toSubscript(power)})`);
      fracMathTerms.push(`(${val} × ${Math.pow(fromBase, power).toFixed(5).replace(/\.?0+$/, '')})`);
    }
  }

  const decimalVal = decimalInt + decimalFrac;

  // Formula generation
  const allTerms = [...terms, ...fracTerms];
  const allMathTerms = [...mathTerms, ...fracMathTerms];
  const toDecimalFormula = allTerms.join(' + ');
  const toDecimalSummed = allMathTerms.join(' + ');

  // 2. Division Steps (Decimal Integer to target base)
  const divisionSteps: {
    dividend: number;
    divisor: number;
    quotient: number;
    remainder: number;
    remainderChar: string;
  }[] = [];

  let tempDecInt = Math.floor(decimalInt);
  if (tempDecInt === 0) {
    divisionSteps.push({
      dividend: 0,
      divisor: toBase,
      quotient: 0,
      remainder: 0,
      remainderChar: '0'
    });
  } else {
    while (tempDecInt > 0) {
      const rem = tempDecInt % toBase;
      const quot = Math.floor(tempDecInt / toBase);
      const remChar = rem.toString(toBase).toUpperCase();
      divisionSteps.push({
        dividend: tempDecInt,
        divisor: toBase,
        quotient: quot,
        remainder: rem,
        remainderChar: remChar
      });
      tempDecInt = quot;
    }
  }

  // 3. Multiplication Steps (Decimal Fractional part to target base)
  const multiplicationSteps: {
    fractional: number;
    multiplier: number;
    product: number;
    digit: number;
    remaining: number;
  }[] = [];

  let tempDecFrac = decimalFrac;
  let iterations = 0;
  const maxIterations = 8; // prevent infinite loop for irrational/repeating fractions

  while (tempDecFrac > 0 && iterations < maxIterations) {
    const prod = tempDecFrac * toBase;
    const digit = Math.floor(prod);
    const remaining = prod - digit;
    multiplicationSteps.push({
      fractional: tempDecFrac,
      multiplier: toBase,
      product: prod,
      digit,
      remaining
    });
    tempDecFrac = remaining;
    iterations++;
  }

  return {
    fromBase,
    toBase,
    input: cleanInput,
    hasFractional,
    toDecimalFormula,
    toDecimalSummed,
    decimalValue: decimalVal,
    divisionSteps,
    multiplicationSteps
  };
}

export function toSubscript(num: number): string {
  const subs = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '-': '⁻'
  };
  return num.toString().split('').map(char => (subs as any)[char] || char).join('');
}
