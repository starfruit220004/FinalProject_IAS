import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  ExternalLink, 
  ShieldAlert, 
  Lock,
  Download,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const LESSONS = [
  {
    id: 'sqli',
    title: 'SQL Injection',
    description: 'Learn how to exploit and prevent SQL Injection vulnerabilities using WebGoat.',
    icon: ShieldAlert,
    color: 'from-red-500 to-orange-600',
    doc: '/IAS - SQL Injection (WebGoat).pdf',
    steps: [
      { img: '/sql injection1.png', text: 'Step 1: Introduction to SQL Injection in WebGoat.' },
      { img: '/sql injection2.png', text: 'Step 2: Review query output to understand how data is displayed to the user.' },
      { img: '/sql injection3.png', text: 'Step 3: Use the UPDATE statement to modify existing data in a table.' },
      { img: '/sql injection4.png', text: 'Step 4: Confirm data integrity by verifying that manual updates were successful.' },
      { img: '/sql injection5.png', text: 'Step 5: Use ALTER TABLE to modify the database schema by adding columns.' },
      { img: '/sql injection6.png', text: 'Step 6: Use the GRANT statement to escalate user permissions to administrator.' },
      { img: '/sql injection7.png', text: 'Step 7: Perform String Injection using OR 1=1 to bypass query logic.' },
      { img: '/sql injection8.png', text: 'Step 8: Perform Numeric Injection using OR 1=1 to leak unquoted data.' },
      { img: '/sql injection9.png', text: 'Step 9: Extract sensitive internal information by successfully compromising confidentiality.' },
      { img: '/sql injection10.png', text: 'Step 10: Attempt an unauthorized Integrity Attack by modifying your own salary.' },
      { img: '/sql injection11.png', text: 'Step 11: Use Stacked Queries (with ;) to execute multiple commands at once.' },
      { img: '/sql injection12.png', text: 'Step 12: Use the DROP TABLE command to delete critical system logs.' },
      { img: '/sql injection13.png', text: 'Final Step: Understand Anti-Forensics by erasing audit trails to hide attack evidence.' },
    ]
  },
  {
    id: 'auth',
    title: 'Broken Authentication',
    description: 'Understand common flaws in authentication mechanisms.',
    icon: Lock,
    color: 'from-blue-500 to-indigo-600',
    doc: '/INSTALLATION OF JAVA AND WEBGOAT.pdf',
    steps: [
      { img: '/broken authentication1.png', text: 'Step 1: Exploring password entropy and the time required for brute-force attacks.' },
      { img: '/broken authenticaation2.png', text: 'Step 2: Testing a strong password to see how long it takes to hack.' },
    ]
  }
];

export default function LessonsPage() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const { theme } = useTheme();

  const openLesson = (lesson) => {
    setActiveLesson(lesson);
    setStepIndex(0);
  };

  const nextStep = () => {
    if (activeLesson && stepIndex < activeLesson.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  if (activeLesson) {
    const step = activeLesson.steps[stepIndex];
    const isLastStep = stepIndex === activeLesson.steps.length - 1;

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumbs / Back */}
        <button 
          onClick={() => setActiveLesson(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Lessons
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content: Image Walkthrough */}
          <div className="flex-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-black/5">
              <div className="aspect-video bg-slate-100 dark:bg-slate-950 relative flex items-center justify-center overflow-hidden">
                <img 
                  src={step.img} 
                  alt={step.text} 
                  className="max-h-full max-w-full object-contain transition-all duration-500"
                  key={step.img}
                />
                
                {/* Progress Overlay */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                  STEP {stepIndex + 1} OF {activeLesson.steps.length}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <activeLesson.icon className="w-5 h-5 text-blue-500" />
                  {activeLesson.title} Walkthrough
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                  {step.text}
                </p>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-10">
                  <button
                    onClick={prevStep}
                    disabled={stepIndex === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold text-sm disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <div className="flex gap-1.5">
                    {activeLesson.steps.map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === stepIndex ? 'bg-blue-500 w-4' : 'bg-slate-300 dark:bg-slate-700'}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={isLastStep}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      isLastStep 
                        ? 'bg-emerald-500 text-white cursor-default' 
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-lg shadow-black/10'
                    }`}
                  >
                    {isLastStep ? <><CheckCircle2 className="w-4 h-4" /> Lesson Complete</> : <>Next Step <ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Documentation & Info */}
          <div className="lg:w-80 shrink-0 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-3xl p-6 text-white dark:text-slate-900 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Insights</h3>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                To further enhance your understanding of the technical details, you may explore our comprehensive laboratory documentation.
              </p>
              
              <a 
                href={activeLesson.doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-blue-500 text-white hover:bg-blue-400 transition-all font-bold text-sm shadow-lg shadow-blue-500/30"
              >
                <Download className="w-4 h-4" />
                Obtain PDF Guide
              </a>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Learning Tips</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">Follow the steps in WebGoat simultaneously.</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">Examine the underlying SQL queries in the documentation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-16">
      {/* Header */}
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">WebGoat Lessons</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
          Master web security through interactive walkthroughs and detailed documentation.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LESSONS.map((lesson) => (
          <div 
            key={lesson.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
              <lesson.icon className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors">
              {lesson.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-base leading-relaxed">
              {lesson.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => openLesson(lesson)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform shadow-lg"
              >
                Start Lesson <ArrowRight className="w-4 h-4" />
              </button>
              
              <a 
                href={lesson.doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors font-bold text-xs uppercase tracking-wider"
              >
                <FileText className="w-4 h-4" />
                Explore Guide
              </a>
            </div>
          </div>
        ))}

        {/* Placeholder for more lessons */}
        <div className="border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center opacity-60">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-500 dark:text-slate-400">More Lessons Coming Soon</h3>
          <p className="text-xs text-slate-400 mt-1">Check back later for Cross-Site Scripting (XSS) and more.</p>
        </div>
      </div>
    </div>
  );
}

// Internal icon needed but not in main imports
function ArrowRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}