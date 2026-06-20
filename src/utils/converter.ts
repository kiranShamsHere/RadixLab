/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BitAnalysis, TwosComplementResult } from '../types';

/**
 * Validates whether a character is permissible in a given base (2 to 36).
 */
export function isValidDigit(char: string, base: number): boolean {
  const code = char.toUpperCase().charCodeAt(0);
  if (code >= 48 && code <= 57) {
    // '0' - '9'
    return code - 48 < base;
  } else if (code >= 65 && code <= 90) {
    // 'A' - 'Z'
    return code - 65 + 10 < base;
  }
  return false;
}

/**
 * Validates a number string for a given base, allowing optional signs and a single decimal point.
 */
export function validateInput(value: string, base: number): boolean {
  let cleaned = value.trim();
  if (!cleaned) return false;

  // Handle common prefixes
  if (base === 16 && cleaned.toLowerCase().startsWith('0x')) {
    cleaned = cleaned.slice(2);
  } else if (base === 2 && cleaned.toLowerCase().startsWith('0b')) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith('+') || cleaned.startsWith('-')) {
    cleaned = cleaned.slice(1);
  }

  if (!cleaned) return false;

  const parts = cleaned.split('.');
  if (parts.length > 2) return false; // More than one decimal point

  return parts.every((part) => {
    if (part === '') return true; // Allowed for fractional side, e.g., "5."
    return part.split('').every((char) => isValidDigit(char, base));
  });
}

/**
 * Converts a fractional decimal digit to its base B string representation.
 */
function fractionToBase(fraction: number, targetBase: number, precision: number = 10): string {
  let res = '';
  let temp = fraction;
  for (let i = 0; i < precision; i++) {
    if (temp === 0) break;
    temp *= targetBase;
    const digitValue = Math.floor(temp);
    res += digitValue.toString(targetBase).toUpperCase();
    temp -= digitValue;
  }
  return res || '0';
}

/**
 * Converts a string number representation from fromBase to toBase, supporting fractions and signs.
 */
export function convertBase(
  input: string,
  fromBase: number,
  toBase: number,
  precision: number = 8
): string {
  let cleaned = input.trim();
  const isNegative = cleaned.startsWith('-');
  if (cleaned.startsWith('+') || cleaned.startsWith('-')) {
    cleaned = cleaned.slice(1);
  }

  // Slice prefix
  if (fromBase === 16 && cleaned.toLowerCase().startsWith('0x')) {
    cleaned = cleaned.slice(2);
  } else if (fromBase === 2 && cleaned.toLowerCase().startsWith('0b')) {
    cleaned = cleaned.slice(2);
  }

  if (!cleaned) return '0';

  const parts = cleaned.split('.');
  const integerPart = parts[0] || '0';
  const fractionalPart = parts[1] || '';

  // 1. Convert integer part to decimal
  let decimalInteger = 0;
  try {
    decimalInteger = parseInt(integerPart, fromBase);
    if (isNaN(decimalInteger)) decimalInteger = 0;
  } catch {
    decimalInteger = 0;
  }

  // 2. Convert fractional part to decimal
  let decimalFraction = 0;
  if (fractionalPart) {
    for (let i = 0; i < fractionalPart.length; i++) {
      const char = fractionalPart[i];
      const digitVal = parseInt(char, fromBase);
      if (!isNaN(digitVal)) {
        decimalFraction += digitVal * Math.pow(fromBase, -(i + 1));
      }
    }
  }

  // 3. Convert integer decimal to targetBase
  let targetInteger = decimalInteger.toString(toBase).toUpperCase();

  // 4. Convert fractional decimal to targetBase
  let targetFraction = '';
  if (decimalFraction > 0) {
    targetFraction = fractionToBase(decimalFraction, toBase, precision);
  }

  const result = targetFraction ? `${targetInteger}.${targetFraction}` : targetInteger;
  return isNegative ? `-${result}` : result;
}

/**
 * Calculates 1's and 2's complements for a signed decimal or binary number in N-bits.
 */
export function calculateTwosComplement(inputValue: string, bitWidth: number): TwosComplementResult {
  let num = 0;
  const trimmed = inputValue.trim();

  if (trimmed.toLowerCase().startsWith('0b')) {
    // Parse binary
    const binStr = trimmed.slice(2);
    num = parseInt(binStr, 2);
    // Treat as signed/unsigned binary depending on left bit
    if (trimmed.length - 2 === bitWidth && binStr[0] === '1') {
      num = num - Math.pow(2, bitWidth);
    }
  } else if (trimmed.toLowerCase().startsWith('0x')) {
    num = parseInt(trimmed.slice(2), 16);
  } else {
    num = parseInt(trimmed, 10);
  }

  if (isNaN(num)) {
    throw new Error('Invalid numeric input.');
  }

  const limitMax = Math.pow(2, bitWidth - 1) - 1;
  const limitMin = -Math.pow(2, bitWidth - 1);

  if (num > limitMax || num < limitMin) {
    throw new Error(`Overflow: input must be between ${limitMin} and ${limitMax} for ${bitWidth}-bit integers.`);
  }

  // Complete conversion process
  let uValue = num;
  if (num < 0) {
    uValue = num + Math.pow(2, bitWidth);
  }

  const binary = uValue.toString(2).padStart(bitWidth, '0');

  // Ones complement
  const ones = binary
    .split('')
    .map((b) => (b === '0' ? '1' : '0'))
    .join('');

  // Twos complement
  const twos = binary; // Representing negative signed number in standard twos complement is simply its unsigned representation!

  return {
    binary,
    onesComplement: ones,
    twosComplement: twos,
    decimal: num,
    bits: bitWidth,
  };
}

/**
 * Translates a given float value to IEEE 754 parts.
 */
export function convertToIEEE754(numStr: string, is64Bit: boolean = false): BitAnalysis {
  const num = parseFloat(numStr);
  if (isNaN(num)) {
    throw new Error('Invalid float number.');
  }

  const buffer = new ArrayBuffer(is64Bit ? 8 : 4);
  const view = new DataView(buffer);
  if (is64Bit) {
    view.setFloat64(0, num);
  } else {
    view.setFloat32(0, num);
  }

  let binary = '';
  const byteLength = is64Bit ? 8 : 4;
  for (let i = 0; i < byteLength; i++) {
    binary += view.getUint8(i).toString(2).padStart(8, '0');
  }

  const sign = parseInt(binary[0]);
  const expBits = is64Bit ? 11 : 8;
  const mantissaBits = is64Bit ? 52 : 23;
  const bias = is64Bit ? 1023 : 127;

  const exponentStr = binary.slice(1, 1 + expBits);
  const mantissaStr = binary.slice(1 + expBits);

  const biasedExponent = parseInt(exponentStr, 2);
  const actualExponent = biasedExponent - bias;

  let hex = '';
  for (let i = 0; i < byteLength; i++) {
    hex += view.getUint8(i).toString(16).padStart(2, '0');
  }

  // Detect precision loss
  const reconstructed = reconstructFloat(sign, biasedExponent, mantissaStr, is64Bit);
  const precisionLoss = Math.abs(reconstructed - num) > Number.EPSILON * Math.max(1, Math.abs(num));

  return {
    sign,
    exponent: exponentStr,
    mantissa: mantissaStr,
    biasedExponent,
    actualExponent,
    binaryRepresentation: binary,
    hexRepresentation: `0x${hex.toUpperCase()}`,
    precisionLoss,
  };
}

function reconstructFloat(
  sign: number,
  biasedExponent: number,
  mantissaStr: string,
  is64Bit: boolean
): number {
  const bias = is64Bit ? 1023 : 127;
  if (biasedExponent === 0) {
    // Subnormal or zero
    let frac = 0;
    for (let i = 0; i < mantissaStr.length; i++) {
      if (mantissaStr[i] === '1') {
        frac += Math.pow(2, -(i + 1));
      }
    }
    return Math.pow(-1, sign) * frac * Math.pow(2, 1 - bias);
  }

  const expMax = is64Bit ? 2047 : 255;
  if (biasedExponent === expMax) {
    return mantissaStr.includes('1') ? NaN : sign === 0 ? Infinity : -Infinity;
  }

  let frac = 1;
  for (let i = 0; i < mantissaStr.length; i++) {
    if (mantissaStr[i] === '1') {
      frac += Math.pow(2, -(i + 1));
    }
  }
  return Math.pow(-1, sign) * frac * Math.pow(2, biasedExponent - bias);
}

/**
 * Converts a decimal value to Gray Code.
 */
export function convertToGray(binaryVal: string): string {
  if (!/^[01]+$/.test(binaryVal)) {
    throw new Error('Gray Code conversion requires standard binary input.');
  }
  let res = binaryVal[0];
  for (let i = 1; i < binaryVal.length; i++) {
    const bit = parseInt(binaryVal[i]) ^ parseInt(binaryVal[i - 1]);
    res += bit.toString();
  }
  return res;
}

/**
 * Converts Gray Code to standard binary.
 */
export function grayToBinary(grayVal: string): string {
  if (!/^[01]+$/.test(grayVal)) {
    throw new Error('Gray Code parsing requires standard binary input.');
  }
  let res = grayVal[0];
  for (let i = 1; i < grayVal.length; i++) {
    const lastBit = parseInt(res[i - 1]);
    const nextBit = parseInt(grayVal[i]);
    res += (lastBit ^ nextBit).toString();
  }
  return res;
}

/**
 * Converts standard integer values to Binary Coded Decimal (BCD).
 */
export function convertToBCD(decimalStr: string): string {
  const cleaned = decimalStr.trim();
  if (!/^\d+$/.test(cleaned)) {
    throw new Error('BCD conversion requires a positive integer decimal.');
  }
  return cleaned
    .split('')
    .map((char) => parseInt(char).toString(2).padStart(4, '0'))
    .join(' ');
}
