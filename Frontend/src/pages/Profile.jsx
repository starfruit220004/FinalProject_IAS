import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { User, Mail, X, LogOut, AlertTriangle, CheckCircle2, Loader2, Key } from 'lucide-react';

export default function Profile({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('info');
  const overlayRef = useRef(null);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTab('info');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwError('');
      setPwSuccess('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    setPwError('');
    setPwSuccess('');
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    const missing = [];
    if (pwForm.newPassword.length < 8) missing.push('at least 8 characters');
    if (!/[a-z]/.test(pwForm.newPassword)) missing.push('a lowercase letter');
    if (!/[A-Z]/.test(pwForm.newPassword)) missing.push('an uppercase letter');
    if (!/[0-9]/.test(pwForm.newPassword)) missing.push('a number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwForm.newPassword)) missing.push('a symbol');

    if (missing.length > 0) {
      setPwError(`Password is missing: ${missing.join(', ')}.`);
      return;
    }

    setPwLoading(true);
    setPwError('');
    try {
      await api('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      setPwSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwLoading(false);
    }
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
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-8 pb-14">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/5 pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-500/30 shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-tight">{user?.username}</h2>
              <p className="text-slate-400 text-xs">{user?.email || 'No email on file'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative -mt-6 mx-6 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex gap-1 z-10 shadow-sm border border-slate-200 dark:border-white/5">
          {['info', 'password'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              {t === 'info' ? 'Profile Info' : 'Change Password'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5">

          {tab === 'info' && (
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
          )}

          {tab === 'password' && (
            <form onSubmit={handlePwSubmit} className="space-y-4">
              {pwError && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl px-4 py-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {pwSuccess}
                </div>
              )}
              {[
                { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
                { name: 'newPassword', label: 'New Password', placeholder: 'Enter new password' },
                { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {field.label}
                  </label>
                  <input
                    type="password"
                    name={field.name}
                    value={pwForm[field.name]}
                    onChange={handlePwChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={pwLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                {pwLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Key className="w-4 h-4" /> Update Password
                  </span>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}