import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder — connect to your auth provider here
    setTimeout(() => {
      setLoading(false);
      alert('Login functionality coming soon! Connect your auth provider.');
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 hero-bg page-enter">
      {/* Decorative blobs */}
      <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-amber-500/06 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-green-900/30 glow-green-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-4 glow-green animate-float">
              <Sprout size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your AgriChat account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="supervisor@agri.uk.gov.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0a0f0a] border border-green-900/40 text-white text-sm placeholder-gray-700 outline-none focus:border-green-600/60 focus:ring-1 focus:ring-green-600/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0a0f0a] border border-green-900/40 text-white text-sm placeholder-gray-700 outline-none focus:border-green-600/60 focus:ring-1 focus:ring-green-600/30 transition-all duration-200"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <a href="#" className="text-xs text-green-500 hover:text-green-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-green-900/30" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-green-900/30" />
          </div>

          {/* Try without login */}
          <Link
            to="/chat"
            className="w-full btn-secondary justify-center py-3 text-sm"
          >
            Try AgriChat without login <ArrowRight size={14} />
          </Link>

          <p className="text-center text-xs text-gray-600 mt-6">
            Don't have an account?{' '}
            <a href="#" className="text-green-500 hover:text-green-300 transition-colors">
              Request access
            </a>
          </p>
        </div>

        {/* Note */}
        <p className="text-center text-xs text-gray-700 mt-5">
          Designed for Uttarakhand Agricultural Supervisors
        </p>
      </div>
    </div>
  );
}
