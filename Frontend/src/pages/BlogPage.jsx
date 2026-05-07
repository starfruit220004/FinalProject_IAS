import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useTheme } from '../context/ThemeContext';
import { Loader2, ArrowLeft, Shield, Key, Lock, Globe, ShieldCheck, BookOpen } from 'lucide-react';

// Category badge colors matching the screenshot
const categoryColors = {
  'SQL Injection':        'bg-red-500 text-white',
  'Broken Authentication':'bg-orange-500 text-white',
  'Security Concepts':    'bg-purple-500 text-white',
  'Authentication':       'bg-blue-500 text-white',
  'Password Security':    'bg-teal-500 text-white',
};

const getCategoryStyle = (cat) =>
  categoryColors[cat] || 'bg-slate-500 text-white';

// Per-category illustrative icons
const categoryIcons = {
  'SQL Injection':         Shield,
  'Broken Authentication': Key,
  'Security Concepts':     Lock,
  'Authentication':        Globe,
  'Password Security':     ShieldCheck,
};

const getCategoryIcon = (cat) => categoryIcons[cat] || BookOpen;

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    api('/content/blogs')
      .then(setBlogs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" />
        Loading articles...
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-32">
      <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl px-6 py-4 text-sm">
        ⚠️ {error}
      </div>
    </div>
  );

  // Article detail view - dark navy in both modes 
  if (selected) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm mb-10 transition-all px-4 py-2 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to articles
          </button>

          <div className="mb-2">
            <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full mb-6 ${getCategoryStyle(selected.category)}`}>
              {selected.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-8 leading-tight">
            {selected.title}
          </h1>

          <div className="text-slate-300 leading-relaxed whitespace-pre-line text-[15px] space-y-4">
            {selected.content}
          </div>

          {(selected.title.toLowerCase().includes('hashing') || selected.content.toLowerCase().includes('hashing') || selected.category === 'Password Security') && (
            <div className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-white">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold">WebGoat Practice</h3>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                To further enhance your understanding of how password hashing is applied in a real security lab, you may explore our comprehensive laboratory documentation.
              </p>
              <a 
                href="/INSTALLATION OF JAVA AND WEBGOAT.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider"
              >
                <BookOpen className="w-4 h-4" /> Explore Laboratory Guide
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Latest Articles</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{blogs.length} articles on web application security</p>
        </div>

        {/* Blog cards */}
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} onSelect={setSelected} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog, onSelect }) {
  const [flipped, setFlipped] = useState(false);
  const CategoryIcon = getCategoryIcon(blog.category);

  const handleClick = () => {
    if (flipped) return;
    setFlipped(true);
    setTimeout(() => onSelect(blog), 380);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer"
      style={{ perspective: '1000px', minHeight: '120px' }}
    >
      <div
        className="h-full"
        style={{
          position: 'relative',
          width: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
        }}
      >
        {/* Front face */}
        <div
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-900/50 rounded-2xl px-5 sm:px-6 py-5 flex items-center gap-4 sm:gap-5 hover:border-blue-400/40 dark:hover:border-blue-500/50 hover:shadow-lg shadow-sm transition-all duration-200 group h-full"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className={`inline-flex items-center text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full mb-2 ${getCategoryStyle(blog.category)}`}>
              {blog.category}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
              {blog.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {blog.content.slice(0, 100)}...
            </p>
          </div>

          {/* Icon */}
          <div className="shrink-0 select-none text-slate-300 dark:text-slate-700">
            <CategoryIcon className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>

        {/* Back face - dark navy flip */}
        <div
          className="absolute inset-0 bg-slate-800 dark:bg-slate-800 border border-slate-700 rounded-2xl px-6 py-5 flex items-center gap-5 shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
          }}
        >
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Opening article...</span>
            <h2 className="text-base font-bold text-white mt-0.5 truncate">{blog.title}</h2>
          </div>
          <div className="shrink-0 select-none opacity-40 text-blue-400">
            <CategoryIcon className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}