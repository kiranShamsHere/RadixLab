/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, ChevronRight, Award, RotateCcw, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'How do you represent the decimal integer 42 in binary format?',
    options: ['101010', '110011', '101101', '111000'],
    correctAnswer: '101010',
    explanation: '42 = 32 + 8 + 2. In binary weights (32, 16, 8, 4, 2, 1), this is 101010.',
  },
  {
    question: 'What is the hexadecimal representation of the binary block 11111010?',
    options: ['FA', 'FC', 'EB', 'EA'],
    correctAnswer: 'FA',
    explanation: 'Dividing into 4-bit chunks: 1111 = 15 (F) and 1010 = 10 (A). Therefore, the value is FA.',
  },
  {
    question: 'What is the sign bit state for a negative floating-point number in IEEE 754?',
    options: ['1', '0', 'Depends on exponent', 'None of the above'],
    correctAnswer: '1',
    explanation: 'In IEEE 754 representation, sign bit = 0 indicates positive real numbers, while sign bit = 1 indicates negative values.',
  },
  {
    question: 'An 8-bit Two\'s Complement number can represent what range of signed integers?',
    options: ['-128 to 127', '-127 to 127', '-256 to 255', '0 to 255'],
    correctAnswer: '-128 to 127',
    explanation: 'For N-bits, the signed limit is -2^(N-1) to 2^(N-1) - 1. For 8-bits: -128 to 127.',
  },
];

export default function EducationalView() {
  const [currentIdx, setCurrentIdx] = React.useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [scores, setScores] = React.useState<number>(0);
  const [isFinished, setIsFinished] = React.useState<boolean>(false);
  const [showExplanation, setShowExplanation] = React.useState<boolean>(false);

  const handleSelectAnswer = (ans: string) => {
    if (selectedAnswer !== null) return; // Prevent double submission
    setSelectedAnswer(ans);
    setShowExplanation(true);
    if (ans === QUIZ_QUESTIONS[currentIdx].correctAnswer) {
      setScores((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScores(0);
    setIsFinished(false);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Section / Interactive Exercises Frame */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
          <Award className="w-4 h-4 text-indigo-400" />
          Interactive DLD Base-Conversion Quiz
        </h2>
        <p className="text-xs text-slate-450 mb-6 font-sans">
          Test your memory and logic conversion speed on standard Computer Science and digital design questions.
        </p>

        {!isFinished ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-slate-500 font-sans">
              <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>Overall Score: {scores}</span>
            </div>

            <div className="text-sm font-bold text-slate-200">
              {QUIZ_QUESTIONS[currentIdx].question}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {QUIZ_QUESTIONS[currentIdx].options.map((option) => {
                const isCorrect = option === QUIZ_QUESTIONS[currentIdx].correctAnswer;
                const isSelected = option === selectedAnswer;

                let btnStyles = 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300';
                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/70 border-emerald-500 text-emerald-300';
                  } else if (isSelected) {
                    btnStyles = 'bg-rose-950/70 border-rose-500 text-rose-300';
                  } else {
                    btnStyles = 'bg-slate-950 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={option}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelectAnswer(option)}
                    className={`border text-xs font-semibold font-mono text-left px-4 py-3 rounded-lg transition cursor-pointer flex justify-between items-center ${btnStyles}`}
                  >
                    <span>{option}</span>
                    {selectedAnswer !== null && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-4.5 space-y-2 mt-4"
                >
                  <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Explanation
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {QUIZ_QUESTIONS[currentIdx].explanation}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Next Question
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <Award className="w-12 h-12 text-indigo-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">Quiz Completed!</h3>
            <p className="text-xs text-slate-400">
              You scored <strong className="text-indigo-400">{scores} out of {QUIZ_QUESTIONS.length}</strong> correct.
            </p>
            <button
              onClick={resetQuiz}
              className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Practice Exercise
            </button>
          </div>
        )}
      </div>

      {/* CS Reference Matrix and Cheatsheet */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl">
        <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest mb-4 inline-flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          General Base equivalents (0-15) cheatsheet
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse max-w-full text-xs font-mono text-slate-300 rounded-lg overflow-hidden border border-slate-700">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Decimal</th>
                <th className="py-2.5 px-3">Binary (4b)</th>
                <th className="py-2.5 px-3">Octal</th>
                <th className="py-2.5 px-3">Hexadecimal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {Array.from({ length: 16 }).map((_, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40 transition">
                  <td className="py-2 px-3 text-slate-100 font-bold">{idx}</td>
                  <td className="py-2 px-3 text-emerald-400 font-bold">{idx.toString(2).padStart(4, '0')}</td>
                  <td className="py-2 px-3 text-sky-400 font-bold">{idx.toString(8)}</td>
                  <td className="py-2 px-3 text-amber-400 font-bold">{idx.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
