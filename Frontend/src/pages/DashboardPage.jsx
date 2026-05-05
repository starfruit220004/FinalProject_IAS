import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Layers, 
  Lightbulb, 
  ShieldCheck, 
  Key, 
  CheckCircle, 
  Database,
  ArrowRight
} from 'lucide-react';

const modes = [
  {
    label: 'Blog',
    path: '/blog',
    icon: BookOpen,
    headerGradient: 'from-blue-400 to-blue-600',
    accentText: 'text-blue-600',
    border: 'border-blue-100',
    badge: '5 ARTICLES',
    title: 'Security Blog',
    desc: 'Read in-depth articles about web vulnerabilities — SQL Injection, Broken Authentication, password hashing, and more.',
    btnClass: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20',
  },
  {
    label: 'Flashcards',
    path: '/flashcards',
    icon: Layers,
    headerGradient: 'from-teal-400 to-cyan-500',
    accentText: 'text-cyan-600',
    border: 'border-cyan-100',
    badge: '10 CARDS',
    title: 'Flashcards',
    desc: 'Flip through concept cards to quickly review key security terms and definitions at your own pace.',
    btnClass: 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20',
  },
  {
    label: 'Quiz',
    path: '/quiz',
    icon: Lightbulb,
    headerGradient: 'from-orange-400 to-amber-500',
    accentText: 'text-orange-600',
    border: 'border-orange-100',
    badge: '8 QUESTIONS',
    title: 'Security Quiz',
    desc: 'Test your knowledge with multiple-choice questions. Get instant feedback and explanations for each answer.',
    btnClass: 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/20',
  },
];

const securityFeatures = [
  { icon: ShieldCheck, label: 'Password Storage', value: 'bcrypt with salt rounds', sub: 'Never stored in plain text' },
  { icon: Key, label: 'Authentication', value: 'JWT — 24h expiry', sub: 'Stateless & scalable' },
  { icon: CheckCircle, label: 'Input Validation', value: 'express-validator', sub: 'Sanitized before processing' },
  { icon: Database, label: 'SQL Safety', value: 'Parameterized queries', sub: 'Injection-proof via Prisma' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2 py-10">

        {/* Learning modes */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5">
            Choose Your Learning Mode
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {modes.map((m) => (
              <div
                key={m.label}
                className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 ${m.border} rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-sm`}
              >
                {/* Colored header */}
                <div className={`bg-gradient-to-br ${m.headerGradient} p-5 flex items-center justify-between`}>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <m.icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-black tracking-widest uppercase text-white/90 bg-white/20 px-3 py-1 rounded-full">
                    {m.badge}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{m.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-5">{m.desc}</p>
                  <button
                    onClick={() => navigate(m.path)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 ${m.btnClass} text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg`}
                  >
                    {m.label === 'Blog' ? 'Read Articles' : m.label === 'Flashcards' ? 'Study Cards' : 'Start Quiz'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security features */}
        <div className="mt-6">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5">
            What's Protecting You Right Now
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityFeatures.map((f) => (
              <div
                key={f.label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 hover:border-blue-500/20 transition-colors shadow-sm"
              >
                <div className="text-blue-500 dark:text-blue-400 mb-3">
                  <f.icon className="w-6 h-6" />
                </div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">{f.label}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{f.value}</div>
                <div className="text-xs text-slate-400">{f.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}