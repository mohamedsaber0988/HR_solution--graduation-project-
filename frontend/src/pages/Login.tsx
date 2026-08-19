import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/login', { email, password });

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user?.role || '');
      localStorage.setItem('user', JSON.stringify(data.user || {}));

      const role = (data.user?.role || '').toLowerCase();

      if (role === 'employee') {
        navigate('/employee/home');
      } else if (role === 'admin') {
        navigate('/admin/home');
      } else if (role === 'supervisor') {
        navigate('/supervisor/Dashboard');
      } else if (role === 'hr_manager') {
        navigate('/hr/home');
      } else {
        navigate('/login');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 font-sans">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-blob rounded-full bg-blue-400/40 mix-blend-multiply blur-3xl filter" />
        <div className="animation-delay-2000 absolute -right-32 top-20 h-96 w-96 animate-blob rounded-full bg-indigo-400/40 mix-blend-multiply blur-3xl filter" />
        <div className="animation-delay-4000 absolute -bottom-32 left-1/4 h-[28rem] w-[28rem] animate-blob rounded-full bg-cyan-400/35 mix-blend-multiply blur-3xl filter" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md space-y-8 rounded-3xl border border-white/60 bg-white/75 p-8 shadow-pro-lg backdrop-blur-2xl"
      >
        <div className="space-y-3 text-center">
          <motion.div
            className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-lg shadow-blue-500/30"
            whileHover={{ scale: 1.06, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="text-2xl font-bold text-white">M</span>
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
          <p className="font-medium text-slate-500">Sign in to your Managly workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-red-100 bg-red-50/90 p-4 text-center text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-slate-700">Email</label>
            <div className="group relative">
              <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                className="pro-input-icon py-3"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-slate-700">Password</label>
            <div className="group relative">
              <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="pro-input-icon py-3 pr-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/40"
              />
              Remember me
            </label>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="pro-btn-primary w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-70"
            whileHover={loading ? {} : { scale: 1.01 }}
            whileTap={loading ? {} : { scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Signing in...
              </span>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          Secure enterprise HR platform
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
