import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { loginWithToken } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token } = res.data;
      const ok = await loginWithToken(token);
      if (ok) nav('/boards');
      else setError('Login failed');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md animate-scaleIn">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">Welcome back</h2>
          <p className="text-slate-600 font-medium">Enter your details to access your workspace.</p>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-200 flex items-center gap-2 shadow-sm">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiMail className="text-lg" />
              </div>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiLock className="text-lg" />
              </div>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <FiArrowRight className="text-lg" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
}
