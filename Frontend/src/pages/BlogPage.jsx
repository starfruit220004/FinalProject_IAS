import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useTheme } from '../context/ThemeContext';

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

// Per-category illustrative icons matching the screenshot
const categoryIcons = {
  'SQL Injection':         '🛡️',
  'Broken Authentication': '🔑',
  'Security Concepts':     '🔒',
  'Authentication':        '🌐',
  'Password Security':     '🔐',
};

const getCategoryIcon = (cat) => categoryIcons[cat] || '📖';

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
        <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
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

  // Article detail view - dark navy in both modes (matching screenshot)
  if (selected) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm mb-10 transition-all px-4 py-2 rounded-lg border border-white/10"
          >
            ← Back to articles
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
          <div className="shrink-0 text-3xl sm:text-4xl select-none">
            {getCategoryIcon(blog.category)}
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
          <div className="shrink-0 text-4xl select-none opacity-60">
            {getCategoryIcon(blog.category)}
          </div>
        </div>
      </div>
    </div>
  );
}