import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, X, LogOut } from 'lucide-react';

export default function Profile({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '??';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/50 border border-slate-200 dark:border-white/5 overflow-hidden">

        {/* Header */}
        <div className="relative bg-linear-to-br from-slate-900 to-slate-800 px-6 pt-8 pb-14">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-cyan-500/5 pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-500/30 shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-tight">{user?.username}</h2>
              <p className="text-slate-400 text-xs">{user?.email || 'No email on file'}</p>
            </div>
          </div>
        </div>

        {/* Info Section Title */}
        <div className="relative -mt-6 mx-6 bg-slate-100 dark:bg-slate-800 rounded-xl py-2.5 px-4 z-10 shadow-sm border border-slate-200 dark:border-white/5">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Account Information
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="space-y-3">
            {[
              { icon: User, label: 'Username', value: user?.username },
              { icon: Mail, label: 'Email', value: user?.email || '—' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3"
              >
                <row.icon className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {row.label}
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}