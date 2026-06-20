/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to convert speech transcript text to clean digits/hex strings based on active base

const WORD_TO_DIGIT: Record<string, string> = {
  'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
  'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
  'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
  'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
  'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
  'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
  'eighty': '80', 'ninety': '90', 'hundred': '100', 'thousand': '1000'
};

const HEX_NATO: Record<string, string> = {
  'alpha': 'A', 'bravo': 'B', 'charlie': 'C', 'delta': 'D', 'echo': 'E', 'foxtrot': 'F',
  'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F'
};

/**
 * Parses conversational spoken numerals into string representing the digital number format.
 */
export function parseSpeechToNumber(transcript: string, base: number): string {
  const words = transcript.toLowerCase().replace(/[-_]/g, ' ').split(/\s+/);
  
  // Try binary sequence parsing (e.g. "one zero one one" -> "1011")
  if (base === 2) {
    let result = '';
    for (const w of words) {
      if (w === 'zero' || w === '0' || w === 'oh') result += '0';
      else if (w === 'one' || w === '1') result += '1';
    }
    if (result) return result;
  }

  // Hex sequence scanning
  if (base === 16) {
    let result = '';
    for (const w of words) {
      if (HEX_NATO[w]) {
        result += HEX_NATO[w];
      } else if (WORD_TO_DIGIT[w] && WORD_TO_DIGIT[w].length === 1) {
        result += WORD_TO_DIGIT[w];
      } else if (/^[0-9a-fA-F]$/.test(w)) {
        result += w.toUpperCase();
      }
    }
    if (result) return result;
  }

  // Standard Decimal sequence word sum (e.g. "two hundred forty five" -> 200 + 40 + 5 = 245)
  // Let's implement a high-grade English oral number parser
  let currentSum = 0;
  let tempSum = 0;
  let hasParsedWord = false;

  for (const word of words) {
    if (WORD_TO_DIGIT[word] !== undefined) {
      hasParsedWord = true;
      const numValue = parseInt(WORD_TO_DIGIT[word]);
      
      if (numValue === 100) {
        tempSum = (tempSum || 1) * 100;
      } else if (numValue === 1000) {
        currentSum += (tempSum || 1) * 1000;
        tempSum = 0;
      } else {
        tempSum += numValue;
      }
    } else {
      const parsedInt = parseInt(word);
      if (!isNaN(parsedInt)) {
        hasParsedWord = true;
        tempSum += parsedInt;
      }
    }
  }

  const calculated = currentSum + tempSum;
  if (hasParsedWord && calculated > 0) {
    // Convert this decimal value to target base if from speech
    if (base === 10) {
      return calculated.toString();
    } else {
      return calculated.toString(base).toUpperCase();
    }
  }

  // Fallback: strip non-alphanumeric punctuation and return digits directly
  const cleanStr = words.map(w => {
    if (/^[0-9a-fA-F]+$/.test(w)) return w;
    return '';
  }).join('');
  
  return cleanStr ? cleanStr.toUpperCase() : transcript.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
}
