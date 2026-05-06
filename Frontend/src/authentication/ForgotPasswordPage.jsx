import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Eye, EyeOff, AlertTriangle, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Step 1 — send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage(res.message);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP only
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Please enter the full 6-digit code.'); return; }
    setError('');
    setStep('password'); // just move to next step, OTP verified on final submit
  };

  // Step 3 — set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }

    const missing = [];
    if (newPassword.length < 8) missing.push('at least 8 characters');
    if (!/[a-z]/.test(newPassword)) missing.push('a lowercase letter');
    if (!/[A-Z]/.test(newPassword)) missing.push('an uppercase letter');
    if (!/[0-9]/.test(newPassword)) missing.push('a number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) missing.push('a symbol');
    if (missing.length > 0) { setError(`Password needs: ${missing.join(', ')}.`); return; }

    setLoading(true);
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, password: newPassword }),
      });
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Back button */}
        {step !== 'success' && (
          <button
            onClick={() => {
              if (step === 'otp') { setStep('email'); setError(''); setOtp(''); }
              else if (step === 'password') { setStep('otp'); setError(''); }
              else navigate('/login');
            }}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {step === 'email' ? 'Back to sign in' : 'Back'}
          </button>
        )}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/5 dark:shadow-black/50">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {/* Success message */}
          {message && !error && step === 'otp' && (
            <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl px-4 py-3 text-sm mb-5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {message}
            </div>
          )}

          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">Forgot password?</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                Enter your email and we'll send you a reset code.
              </p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <>Send Reset Code <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2: OTP only ── */}
          {step === 'otp' && (
            <>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">Enter reset code</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="000000"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-center text-lg font-black tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  Verify Code <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setError(''); setOtp(''); }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Didn't get a code? Try again
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Step 3: New Password ── */}
          {step === 'password' && (
            <>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">Set new password</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                Enter your new password below.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</>
                  ) : (
                    <>Reset Password <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── Step 4: Success ── */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Password reset!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl transition-all"
              >
                Sign In Now
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}