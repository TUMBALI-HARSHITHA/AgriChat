import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Login functionality coming soon! Connect your auth provider.');
    }, 1200);
  };

  return (
    /* full-viewport centred layout, offset for fixed navbar */
    <div
      className="min-h-screen hero-bg flex items-center justify-center px-6 py-12"
      style={{ paddingTop: 'calc(64px + 2rem)' }}
    >
      {/* decorative orbs */}
      <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-amber-500/06 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* ── card ── */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-green-900/30 glow-green-sm">

          {/* logo + heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-4 glow-green">
              <Sprout size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your AgriChat account</p>
          </div>

          {/* form */}
          <form onSubmit={submit} className="flex flex-col gap-5">

            {/* email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handle}
                  required
                  placeholder="supervisor@agri.uk.gov.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0a0f0a] border border-green-900/40 text-white text-sm placeholder-gray-700 outline-none focus:border-green-600/60 focus:ring-1 focus:ring-green-600/20 transition-all"
                />
              </div>
            </div>

            {/* password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handle}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0a0f0a] border border-green-900/40 text-white text-sm placeholder-gray-700 outline-none focus:border-green-600/60 focus:ring-1 focus:ring-green-600/20 transition-all"
                />
                <button
                  type="button"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* forgot */}
            <div className="text-right -mt-2">
              <a href="#" className="text-xs text-green-500 hover:text-green-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary justify-center w-full py-3 text-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                <><LogIn size={17} /> Sign In</>
              )}
            </button>
          </form>

          {/* divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-green-900/30" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-green-900/30" />
          </div>

          {/* guest CTA */}
          <Link to="/chat" className="btn-secondary w-full justify-center py-3 text-sm">
            Try without login <ArrowRight size={14} />
          </Link>

          <p className="text-center text-xs text-gray-600 mt-5">
            No account?{' '}
            <a href="#" className="text-green-500 hover:text-green-300 transition-colors">Request access</a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          For Uttarakhand Agricultural Supervisors
        </p>
      </div>
    </div>
  );
}
