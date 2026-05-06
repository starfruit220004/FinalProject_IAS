import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { useTheme } from '../context/ThemeContext';
import { Loader2, ArrowLeft, ArrowRight, RotateCw, PartyPopper, CheckCircle2, ChevronDown } from 'lucide-react';

const TEAM = [
  { name: 'Danny D.P. Dinglasa Jr.',    initials: 'DD', color: 'from-cyan-500 to-blue-600' },
  { name: 'Neal Jean L. Claro',         initials: 'NC', color: 'from-violet-500 to-purple-600', image: '/neal.jpg' },
  { name: 'Hannah Jean T. Baimbingan',  initials: 'HB', color: 'from-emerald-500 to-teal-600', image: '/hannah.jpg' },
  { name: 'Erica C. Aquino',            initials: 'EA', color: 'from-pink-500 to-rose-600',    image: '/erica.jpg' },
  { name: 'Junairah B. Guarino',        initials: 'JG', color: 'from-amber-500 to-orange-600' },
];

export default function FlashcardsPage() {
  const [cards, setCards] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { theme } = useTheme();
  const teamRef = useRef(null);

  useEffect(() => {
    api('/content/flashcards').then((data) => {
      setCards(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(cards.map((c) => c.category)))];

  const filterBy = (cat) => {
    setActiveCategory(cat);
    setFiltered(cat === 'All' ? cards : cards.filter((c) => c.category === cat));
    setIndex(0);
    setFlipped(false);
  };

  const next = () => { setIndex((i) => Math.min(i + 1, filtered.length - 1)); setFlipped(false); };
  const prev = () => { setIndex((i) => Math.max(i - 1, 0)); setFlipped(false); };

  const scrollToTeam = () => teamRef.current?.scrollIntoView({ behavior: 'smooth' });

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="animate-spin h-5 w-5 text-cyan-600 dark:text-cyan-500" />
        Loading flashcards...
      </div>
    </div>
  );

  const card = filtered[index];
  const pct = filtered.length > 1 ? Math.round((index / (filtered.length - 1)) * 100) : 100;
  const done = index === filtered.length - 1;

  const backBg   = theme === 'dark' ? 'bg-white'      : 'bg-slate-900';
  const backText = theme === 'dark' ? 'text-slate-900' : 'text-white';
  const backLabel = theme === 'dark' ? 'text-blue-600' : 'text-cyan-400';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-10">

      {/* Header */}
      <div className="mb-7 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Study Cards</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Click a card to flip and reveal the answer</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => filterBy(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              cat === activeCategory
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-500 font-medium whitespace-nowrap">{index + 1} / {filtered.length}</span>
      </div>

      {/* Card */}
      {card && (
        <div
          className="cursor-pointer mb-6"
          style={{ perspective: '1200px', minHeight: '280px' }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div
            className="h-full min-h-[280px]"
            style={{
              position: 'relative',
              width: '100%',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center p-6 sm:p-8 text-center shadow-sm dark:shadow-none min-h-[280px]"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-4">Question</div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">{card.question}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-600 flex items-center gap-1.5">
                <RotateCw className="w-3 h-3" /> Click to reveal answer
              </div>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 ${backBg} border ${theme === 'dark' ? 'border-white' : 'border-slate-800'} rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center shadow-lg dark:shadow-none min-h-[280px]`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase ${backLabel} mb-4`}>Answer</div>
              <div className={`text-sm sm:text-base ${backText} leading-relaxed font-medium`}>{card.answer}</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={prev}
          disabled={index === 0}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-semibold text-sm rounded-xl disabled:opacity-40 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Prev
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
        >
          <RotateCw className="w-4 h-4" /> Flip
        </button>
        <button
          onClick={next}
          disabled={index === filtered.length - 1}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-white font-semibold text-sm rounded-xl disabled:opacity-40 transition-all ${
            done ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
          }`}
        >
          {done ? <><CheckCircle2 className="w-4 h-4" /> Done!</> : <>Next <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>

      {/* Completion */}
      {done && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 text-center shadow-sm">
          <div className="flex justify-center mb-2 text-emerald-500">
            <PartyPopper className="w-10 h-10" />
          </div>
          <div className="text-base font-bold text-emerald-800 dark:text-emerald-400 mb-1">
            You've reviewed all {filtered.length} cards!
          </div>
          <div className="text-sm text-emerald-700 dark:text-emerald-500/80 mb-4">Great work. Try the Quiz to test your knowledge.</div>
          <button
            onClick={() => { setIndex(0); setFlipped(false); }}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Restart
          </button>
        </div>
      )}

      {/* ── Scroll-to-team hint ── */}
      <div className="mt-10 mb-2">
        <button
          onClick={scrollToTeam}
          className="w-full flex flex-col items-center gap-1.5 py-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:border-cyan-400 dark:hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all group"
        >
          <span className="text-xs font-semibold tracking-widest uppercase">Meet the Team</span>
          <span className="text-[11px]">Curious who made this? Scroll down 👇</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-cyan-500" />
        </button>
      </div>

      {/* ── Meet the Team ── */}
      <div ref={teamRef} className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-500 mb-1">The People Behind This</p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Meet the Team</h2>
          <div className="w-10 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-2 w-[120px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:shadow-md dark:shadow-none hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-black text-base shadow-sm`}>
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  member.initials
                )}
              </div>
              <p className="text-center text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
                {member.name}
              </p>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                Member
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}