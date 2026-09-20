'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Wallet, Mail, Lock, User as UserIcon, ArrowRight, Sparkles, X, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  defaultMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signup' }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('Please enter a valid email address');
          setLoading(false);
          return;
        }
        if (password.length < 4) {
          setError('Password must be at least 4 characters');
          setLoading(false);
          return;
        }
        await signup(name.trim(), email.trim(), password);
      } else {
        if (!email.trim()) {
          setError('Please enter your email');
          setLoading(false);
          return;
        }
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await login('akash@example.com', 'demo123');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 items-center justify-center shadow-xl shadow-emerald-500/30 text-slate-950 font-black mb-3">
            <Wallet className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {mode === 'signup' ? 'Create SpendWise Account' : 'Welcome Back to SpendWise'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signup'
              ? 'Start tracking monthly salary, expenses & savings goals'
              : 'Sign in to access your personal financial dashboard'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signup'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Akash Gupta"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer mt-2"
          >
            <span>{mode === 'signup' ? 'Continue to Financial Setup' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Explore with Demo Account</span>
          </button>

          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Encrypted local session • Zero server tracking</span>
          </p>
        </div>
      </div>
    </div>
  );
}
