// src/components/QuizModal.tsx
// Interactive flashcard quiz modal triggered from Codex "Test Me", Atlas markers, or Coach mode

import React, { useState } from 'react';
import { useMirrahStore } from '../store/useMirrahStore';
import { X, CheckCircle, AlertTriangle, ArrowRight, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizzes';

export const QuizModal: React.FC = () => {
  const { activeQuiz, closeQuiz, answerQuiz, openQuiz } = useMirrahStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!activeQuiz) return null;

  const handleSelectOption = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
    setSubmitted(true);
    const isCorrect = idx === activeQuiz.correctAnswer;
    answerQuiz(activeQuiz.topic, activeQuiz.id, isCorrect);
  };

  const handleNextRandomQuestion = () => {
    setSelectedOption(null);
    setSubmitted(false);
    // Pick another question from same topic or any
    const pool = QUIZ_QUESTIONS.filter((q) => q.id !== activeQuiz.id && q.topic === activeQuiz.topic);
    const nextQ = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
    openQuiz(nextQ);
  };

  const isCorrect = selectedOption === activeQuiz.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-parchment-950 border border-kharaan/40 rounded-xl p-5 shadow-2xl text-parchment-200 text-sm font-sans">
        {/* Rivets */}
        <div className="rivet-tl" />
        <div className="rivet-tr" />
        <div className="rivet-bl" />
        <div className="rivet-br" />

        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-kharaan/20 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-kharaan/20 text-kharaan border border-kharaan/30">
              Topic: {activeQuiz.topic}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-parchment-900 text-parchment-300 border border-parchment-400/20">
              {activeQuiz.difficulty}
            </span>
          </div>
          <button
            onClick={closeQuiz}
            className="text-parchment-400 hover:text-parchment-100 p-1 rounded hover:bg-parchment-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <h3 className="text-base font-serif font-bold text-parchment-100 leading-snug">
            {activeQuiz.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {activeQuiz.options.map((opt: string, idx: number) => {
            let btnStyle = 'bg-parchment-900/70 hover:bg-parchment-900 text-parchment-200 border-parchment-400/20';

            if (submitted) {
              if (idx === activeQuiz.correctAnswer) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
              } else {
                btnStyle = 'bg-parchment-950/40 text-parchment-500 border-transparent opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {submitted && idx === activeQuiz.correctAnswer && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
                {submitted && idx === selectedOption && idx !== activeQuiz.correctAnswer && (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Box */}
        {submitted && (
          <div
            className={`p-3 rounded-lg border text-xs mb-4 animate-in fade-in duration-200 ${
              isCorrect
                ? 'bg-emerald-950/50 border-emerald-600/40 text-emerald-200'
                : 'bg-red-950/50 border-red-600/40 text-red-200'
            }`}
          >
            <div className="font-bold font-serif mb-1 flex items-center gap-1.5">
              {isCorrect ? 'Correct! Mastery Recorded.' : 'Incorrect. Scenario Reality Check:'}
            </div>
            <p className="leading-relaxed opacity-90">{activeQuiz.explanation}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-kharaan/20 flex justify-between items-center">
          <div className="text-[10px] text-parchment-400 font-mono">
            {submitted ? (isCorrect ? '+ Mastery Score Added' : 'Reviewed in Topic Log') : 'Select one option'}
          </div>

          <div className="flex gap-2">
            {submitted && (
              <button
                onClick={handleNextRandomQuestion}
                className="flex items-center gap-1 px-3 py-1.5 bg-kharaan hover:bg-kharaan-light text-ink-dark font-serif font-bold text-xs rounded transition-all shadow"
              >
                <span>Drill Another</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={closeQuiz}
              className="px-3 py-1.5 bg-parchment-900 hover:bg-parchment-800 text-parchment-300 hover:text-parchment-100 text-xs rounded border border-parchment-400/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
