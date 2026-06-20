/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SelectedView =
  | 'converter'
  | 'calculator'
  | 'scientific'
  | 'batch'
  | 'learn'
  | 'ieee754'
  | 'signed'
  | 'ascii'
  | 'color'
  | 'hash'
  | 'base64'
  | 'uuid'
  | 'regex'
  | 'bitpatterns'
  | 'numberline'
  | 'binarytree'
  | 'bytesbits';

export type BaseType = '2' | '8' | '10' | '16' | 'custom';

export interface ConversionRecord {
  id: string;
  timestamp: string;
  input: string;
  fromBase: number;
  toBase: number;
  result: string;
}

export interface BitAnalysis {
  sign: number;
  exponent: string;
  mantissa: string;
  biasedExponent: number;
  actualExponent: number;
  binaryRepresentation: string;
  hexRepresentation: string;
  precisionLoss: boolean;
}

export interface TwosComplementResult {
  binary: string;
  onesComplement: string;
  twosComplement: string;
  decimal: number;
  bits: number;
}
