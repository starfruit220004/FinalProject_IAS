import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1 — send OTP to email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP + set new password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, password: newPassword }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <button
          onClick={() => step === 'otp' ? setStep('email') : navigate('/login')}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm mb-8 transition-colors"
        >
          ← {step === 'otp' ? 'Back' : 'Back to sign in'}
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/5 dark:shadow-black/50">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-500/30">
              S
            </div>
            <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">SecureLearn</span>
          </div>

          {/* ── Success state ── */}
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-2xl mx-auto mb-5">
                ✅
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Password reset!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                Go to Sign In →
              </button>
            </div>

          ) : step === 'email' ? (
            /* ── Step 1: Email ── */
            <>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-4 mb-1">Forgot your password?</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                Enter your account email and we'll send you a 6-digit reset code.
              </p>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
                  <span className="shrink-0">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Enter your registered email"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending code...
                    </span>
                  ) : 'Send Reset Code →'}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
                Remembered your password?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </>

          ) : (
            /* ── Step 2: OTP + new password ── */
            <>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-4 mb-1">Enter your reset code</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                We sent a 6-digit code to{' '}
                <span className="text-slate-900 dark:text-white font-semibold">{email}</span>.
                Enter it below along with your new password.
              </p>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
                  <span className="shrink-0">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    6-digit code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="123456"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-widest text-center font-mono text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="Create a strong password"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Repeat your new password"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Resetting...
                    </span>
                  ) : 'Reset Password →'}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
                Didn't receive the code?{' '}
                <button
                  onClick={() => { setStep('email'); setError(''); setOtp(''); }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                >
                  Try again
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}