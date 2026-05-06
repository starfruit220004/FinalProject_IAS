import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Lock, 
  Key, 
  CheckCircle, 
  ArrowRight,
  UserPlus,
  BookOpen,
  Layers,
  Lightbulb,
  ChevronDown
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "SQL Injection",
    desc: "Understand how attackers manipulate database queries and how parameterized statements stop them cold.",
    color: "from-blue-500 to-blue-700",
    badge: "Attack & Defense",
  },
  {
    icon: Lock,
    title: "Broken Authentication",
    desc: "Explore session flaws, credential stuffing, and how JWT tokens keep your users secure.",
    color: "from-teal-500 to-teal-700",
    badge: "OWASP Top 10",
  },
  {
    icon: Key,
    title: "Password Security",
    desc: "Learn why bcrypt, salts, and proper hashing practices are non-negotiable in modern applications.",
    color: "from-indigo-500 to-indigo-700",
    badge: "Cryptography",
  },
  {
    icon: CheckCircle,
    title: "Input Validation",
    desc: "Master the first line of defense — sanitizing user data before it ever touches your system.",
    color: "from-cyan-500 to-cyan-700",
    badge: "Best Practice",
  },
];

const stats = [
  { value: "10+", label: "Security Topics" },
  { value: "10", label: "Flashcards" },
  { value: "8", label: "Quiz Questions" },
  { value: "5", label: "Blog Articles" },
];

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create an Account",
    desc: "Sign up in seconds with a username and password — secured with bcrypt hashing.",
  },
  {
    num: "02",
    icon: BookOpen,
    title: "Read the Blog",
    desc: "Start with in-depth articles explaining each vulnerability and its real-world impact.",
  },
  {
    num: "03",
    icon: Layers,
    title: "Study Flashcards",
    desc: "Flip through interactive cards to reinforce key concepts at your own pace.",
  },
  {
    num: "04",
    icon: Lightbulb,
    title: "Take the Quiz",
    desc: "Test your knowledge with multiple-choice questions and instant explanations.",
  },
];

const TEAM = [
  { name: "Danny D.P. Dinglasa Jr.", initials: "DD", color: "from-cyan-500 to-blue-600" },
  { name: "Neal Jean L. Claro",      initials: "NC", color: "from-violet-500 to-purple-600", image: "/neal.jpg" },
  { name: "Hannah Jean T. Baimbingan", initials: "HB", color: "from-emerald-500 to-teal-600", image: "/hannah.jpg" },
  { name: "Erica C. Aquino",         initials: "EA", color: "from-pink-500 to-rose-600", image: "/erica.jpg" },
  { name: "Junairah B. Guarino",     initials: "JG", color: "from-amber-500 to-orange-600" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const teamRef = useRef(null);

  const phrases = [
    "The Right Way",
    "SQL Injection",
    "Broken Auth",
    "Input Validation",
    "Password Security",
  ];
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = phrases[phraseIndex];
    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setTypedText(current.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 120);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        const next = (phraseIndex + 1) % phrases.length;
        setPhraseIndex(next);
        setCharIndex(0);
        setTypedText("");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, phraseIndex]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const nodes = el.querySelectorAll("[data-animate]");
    nodes.forEach((node, i) => {
      node.style.opacity = "0";
      node.style.transform = "translateY(24px)";
      node.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
      setTimeout(() => {
        node.style.opacity = "1";
        node.style.transform = "translateY(0)";
      }, 80);
    });
  }, []);

  const scrollToTeam = () => {
    teamRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden transition-colors duration-300">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-28 pb-16 px-6 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }}
        />
        <div className="absolute top-16 left-1/4 w-72 h-72 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-1/4 w-56 h-56 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div
            data-animate
            className="inline-flex items-center gap-2 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse" />
            Final Project Security Learning Hub
          </div>

          <h1
            data-animate
            className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.06] tracking-tight text-slate-900 dark:text-white mb-7"
          >
            Learn Web Security
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent min-h-[1.2em] inline-block">
              {typedText}
              <span className="animate-pulse text-cyan-600 dark:text-cyan-400">|</span>
            </span>
          </h1>

          <p
            data-animate
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Master the OWASP Top 10, SQL Injection, JWT authentication, and more
            through interactive flashcards, quizzes, and in-depth articles — all
            in one secure platform.
          </p>

          <div data-animate className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Start Learning Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold text-base rounded-xl transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          {/* ── Scroll-to-team hint ── */}
          <div data-animate className="mt-8 flex justify-center">
            <button
              onClick={scrollToTeam}
              className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 group"
            >
              <span className="text-xs font-semibold tracking-widest uppercase">Meet the Team</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-600">Curious who built this? Scroll down</span>
              <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-cyan-500" />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div
          data-animate
          className="relative max-w-3xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-900/80 backdrop-blur px-6 py-8 text-center">
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500 font-medium tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="pt-16 pb-20 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">What You'll Learn</div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Core Security Concepts</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Every module is grounded in real-world attack patterns and defenses used by professional security engineers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 hover:border-blue-500/30 dark:hover:border-white/10 hover:-translate-y-1.5 transition-all duration-300 cursor-default overflow-hidden shadow-sm dark:shadow-none flex flex-col items-center text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className="text-blue-500 dark:text-blue-400 mb-5 transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="w-10 h-10" />
                </div>
                <div className="inline-block text-[10px] font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 bg-cyan-600/10 dark:bg-cyan-400/10 px-2.5 py-1 rounded-full mb-4">
                  {f.badge}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="pt-16 pb-20 px-6 bg-slate-100 dark:bg-slate-900/40 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">How It Works</div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Four Steps to Mastery</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group flex gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 hover:border-blue-500/20 dark:hover:border-white/10 transition-all duration-300 shadow-sm dark:shadow-none hover:-translate-y-0.5"
              >
                <div className="bg-slate-50 dark:bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-cyan-500 transition-colors duration-300 shrink-0">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 mb-1">STEP {step.num}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-base">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-20 pb-24 px-6 border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none blur-[100px] rounded-full"
          style={{ background: "rgba(37,99,235,0.07)" }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Ready to level up<br />your security skills?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg leading-relaxed">
            Join SecureLearn and start mastering web application security today — completely free.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── MEET THE TEAM ── */}
      <section
        ref={teamRef}
        className="pt-16 pb-20 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-transparent"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mb-3">The People Behind This</div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3">Meet the Team</h2>
            <div className="w-10 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
          </div>

          {/* 5 members — wraps gracefully on mobile */}
          <div className="flex flex-wrap justify-center gap-5">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-3 w-[140px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-md dark:shadow-none hover:-translate-y-1 transition-all duration-200"
              >
                {/* Avatar */}
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-black text-lg shadow-sm`}
                >
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.initials
                  )}
                </div>
                {/* Name */}
                <p className="text-center text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
                  {member.name}
                </p>
                {/* Badge */}
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                  Member
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
            <span className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              SL
            </span>
            SecureLearn
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-600 text-center max-w-sm leading-relaxed">
            The comprehensive hub for mastering Information Assurance & Security through interactive learning and practice.
          </p>
          <div className="h-px w-10 bg-slate-200 dark:bg-slate-800" />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 Final Project Security Learning Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}