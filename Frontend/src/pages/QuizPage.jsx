import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useTheme } from '../context/ThemeContext';
import { Loader2, Trophy, ThumbsUp, BookOpen, XCircle, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { question, chosen, result }
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    api('/content/quizzes').then((data) => { setQuestions(data); setLoading(false); });
  }, []);

  const q = questions[index];
  const pct = questions.length ? Math.round((index / questions.length) * 100) : 0;

  const choose = async (opt) => {
    if (selected || checking) return;
    setSelected(opt);
    setChecking(true);
    try {
      const res = await api('/content/quizzes/check', {
        method: 'POST',
        body: JSON.stringify({ id: q.id, answer: opt }),
      });
      if (res.isCorrect) setScore((s) => s + 1);
      setAnswers((prev) => [...prev, { question: q, chosen: opt, result: res }]);
    } catch {}
    setChecking(false);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setScore(0);
    setFinished(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="animate-spin h-5 w-5 text-orange-600 dark:text-orange-500" />
        Loading quiz...
      </div>
    </div>
  );

  // Card styling logic
  const cardBg = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const cardText = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const cardSubText = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const cardBorder = theme === 'dark' ? 'border-orange-500/20' : 'border-orange-200';

  // ── End screen ──────────────────────────────────────────────────────────────
  if (finished) {
    const wrongAnswers = answers.filter((a) => !a.result.isCorrect);
    const ResultIcon = score === questions.length ? Trophy : score >= questions.length * 0.6 ? ThumbsUp : BookOpen;

    const optLabel = (q, key) => {
      const map = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d };
      return map[key];
    };

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {/* Score card */}
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-10 text-center mb-8 shadow-sm dark:shadow-none`}>
          <div className="flex justify-center mb-4 text-orange-500">
            <ResultIcon className="w-16 h-16" />
          </div>
          <div className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} mb-3`}>Quiz Complete</div>
          <div className={`text-6xl font-black ${cardText} mb-6`}>
            {score}
            <span className={`${cardSubText} text-4xl`}>/{questions.length}</span>
          </div>
          <button
            onClick={restart}
            className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>

        {/* Wrong answers review */}
        {wrongAnswers.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              Questions You Missed{' '}
              <span className="text-slate-500 dark:text-slate-400 font-normal text-base">({wrongAnswers.length})</span>
            </h2>
            <div className="space-y-4">
              {wrongAnswers.map((a, i) => (
                <div key={i} className={`${cardBg} border ${cardBorder} rounded-2xl p-5 shadow-sm`}>
                  <div className={`text-xs font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} uppercase tracking-widest mb-2`}>
                    {a.question.category}
                  </div>
                  <p className={`text-sm font-bold ${cardText} mb-4 leading-snug`}>{a.question.question}</p>

                  {/* Their answer */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 text-sm mb-2">
                    <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold bg-red-500 text-white shrink-0">
                      {a.chosen}
                    </span>
                    <span className="flex-1">{optLabel(a.question, a.chosen)}</span>
                    <span className="flex items-center gap-1 text-red-500 text-xs font-semibold shrink-0">
                      <XCircle className="w-3 h-3" /> Your answer
                    </span>
                  </div>

                  {/* Correct answer */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-sm mb-3">
                    <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold bg-emerald-500 text-white shrink-0">
                      {a.result.correctAnswer}
                    </span>
                    <span className="flex-1">{optLabel(a.question, a.result.correctAnswer)}</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Correct
                    </span>
                  </div>

                  {/* Explanation */}
                  {a.result.explanation && (
                    <p className={`text-xs ${cardSubText} leading-relaxed mb-4`}>{a.result.explanation}</p>
                  )}

                  {(a.question.question.toLowerCase().includes('hashing') || a.question.category === 'Password Security') && (
                    <a 
                      href="/INSTALLATION OF JAVA AND WEBGOAT.docx" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline uppercase tracking-tighter"
                    >
                      <BookOpen className="w-3 h-3" /> Study WebGoat Lesson for this topic
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {wrongAnswers.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm">You got every question right. Amazing! 🎉</p>
        )}
      </div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────────
  const opts = [
    { key: 'A', text: q.option_a },
    { key: 'B', text: q.option_b },
    { key: 'C', text: q.option_c },
    { key: 'D', text: q.option_d },
  ];

  const getStyle = (key) => {
    if (!selected) {
      return theme === 'dark' 
        ? 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-orange-500 hover:bg-orange-500/5 cursor-pointer'
        : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 cursor-pointer';
    }
    if (key === selected) {
      return 'border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-800 dark:text-orange-400 cursor-default';
    }
    return theme === 'dark'
      ? 'border-slate-800 bg-slate-900 text-slate-600 cursor-default opacity-60'
      : 'border-slate-200 bg-white text-slate-400 cursor-default opacity-60';
  };

  const getBadgeStyle = (key) => {
    if (!selected) return theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500';
    if (key === selected) return 'bg-orange-500 text-white';
    return theme === 'dark' ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-10">
      {/* Header — no live score */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">Security Quiz</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Answer all questions to see your results.</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-center shrink-0">
          <div className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400">
            {index + 1}<span className="text-orange-300 dark:text-orange-600 text-xs sm:text-sm font-normal">/{questions.length}</span>
          </div>
          <div className="text-[10px] text-orange-400 dark:text-orange-500 font-medium uppercase tracking-widest">Question</div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mb-7 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Question card */}
      <div className={`${cardBg} border ${cardBorder} rounded-2xl p-5 sm:p-6 mb-4 shadow-sm`}>
        <div className={`text-[10px] sm:text-xs font-bold ${theme === 'dark' ? 'text-orange-600' : 'text-orange-500'} uppercase tracking-widest mb-3`}>
          Question {index + 1} · {q.category}
        </div>
        <p className={`text-base sm:text-lg font-bold ${cardText} leading-snug mb-5`}>{q.question}</p>

        <div className="space-y-2">
          {opts.map((o) => (
            <button
              key={o.key}
              onClick={() => choose(o.key)}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm text-left font-medium transition-all duration-150 ${getStyle(o.key)}`}
            >
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-colors ${getBadgeStyle(o.key)}`}>
                {o.key}
              </span>
              <span className="flex-1">{o.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Next button appears after selecting — no right/wrong hint */}
      {selected && (
        <button
          onClick={next}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20"
        >
          {index + 1 >= questions.length ? <>See Results <ArrowRight className="w-4 h-4" /></> : <>Next Question <ArrowRight className="w-4 h-4" /></>}
        </button>
      )}
    </div>
  );
}