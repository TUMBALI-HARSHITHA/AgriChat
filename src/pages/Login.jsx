import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, User } from 'lucide-react';
import { Button, Input, Modal } from '../components/ui';
import { API_BASE_URL } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState(() => {
    const remembered = localStorage.getItem('agrichat_remembered_email') || '';
    return { name: '', email: remembered, password: '' };
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    
    if (token && userStr) {
      try {
        localStorage.setItem('agrichat_token', token);
        localStorage.setItem('agrichat_user', decodeURIComponent(userStr));
        window.dispatchEvent(new Event('storage'));
        navigate('/chat');
      } catch (err) {
        setError('OAuth sign in failed. Please try again.');
      }
    }
  }, [navigate]);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '', name: '', new_password: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleResetFormChange = e => setResetForm({ ...resetForm, [e.target.name]: e.target.value });

  const handleResetSubmit = async e => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setResetSuccess('Password reset successfully! You can now log in with your new password.');
      setResetForm({ email: '', name: '', new_password: '' });
    } catch (err) {
      setResetError(err.message || 'An error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMode = e => {
    e.preventDefault();
    setIsRegister(!isRegister);
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        // 1. Call Register endpoint
        const registerRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            password: form.password,
            role: 'Supervisor'
          }),
        });

        const registerData = await registerRes.json();
        if (!registerRes.ok) {
          throw new Error(registerData.detail || 'Registration failed');
        }
      }

      // 2. Call Login endpoint (auto-login after registration)
      const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.detail || 'Login failed');
      }

      localStorage.setItem('agrichat_token', loginData.token);
      localStorage.setItem('agrichat_user', JSON.stringify(loginData.user));

      // Dispatch a storage event so Navbar updates immediately
      window.dispatchEvent(new Event('storage'));

      navigate('/chat');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
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
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-4 glow-green">
              <Sprout size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isRegister ? 'Sign up for an AgriChat account' : 'Sign in to your AgriChat account'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={submit} className="flex flex-col gap-5">

            {/* full name (only when signing up) */}
            {isRegister && (
              <Input
                id="login-name"
                type="text"
                name="name"
                label="Full Name"
                value={form.name}
                onChange={handle}
                required
                placeholder="Harshitha Tumbali"
                icon={<User size={15} />}
              />
            )}

            {/* email */}
            <Input
              id="login-email"
              type="email"
              name="email"
              label="Email"
              value={form.email}
              onChange={handle}
              required
              placeholder="supervisor@agri.uk.gov.in"
              icon={<Mail size={15} />}
            />

            {/* password */}
            <Input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              name="password"
              label="Password"
              value={form.password}
              onChange={handle}
              required
              placeholder="••••••••"
              icon={<Lock size={15} />}
              rightElement={
                <button
                  type="button"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass(v => !v)}
                  className="text-gray-600 hover:text-gray-300 transition-colors cursor-pointer flex items-center justify-center p-1 rounded hover:bg-green-900/10"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {!isRegister && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-xs text-green-500 hover:text-green-300 transition-colors cursor-pointer bg-transparent border-none outline-none"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* submit */}
            <Button
              id="login-submit-btn"
              type="submit"
              isLoading={loading}
              className="w-full justify-center py-3 text-sm"
            >
              <LogIn size={17} className="mr-1.5" /> {isRegister ? 'Register' : 'Sign In'}
            </Button>
          </form>

          {/* divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-green-900/30" />
            <span className="text-xs text-gray-600">or sign in with</span>
            <div className="flex-1 h-px bg-green-900/30" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              className="w-full justify-center py-2.5 text-sm flex items-center gap-2 border border-green-800/30 hover:bg-green-900/10 text-white"
              onClick={() => {
                window.location.href = `${API_BASE_URL}/api/auth/oauth/login/google`;
              }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-center py-2.5 text-sm flex items-center gap-2 border border-green-800/30 hover:bg-green-900/10 text-white"
              onClick={() => {
                window.location.href = `${API_BASE_URL}/api/auth/oauth/login/github`;
              }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </Button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-5">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button onClick={toggleMode} className="text-green-500 hover:text-green-300 transition-colors cursor-pointer font-bold underline bg-transparent border-none outline-none">
                  Sign In
                </button>
              </>
            ) : (
              <>
                No account?{' '}
                <button onClick={toggleMode} className="text-green-500 hover:text-green-300 transition-colors cursor-pointer font-bold underline bg-transparent border-none outline-none">
                  Request access
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          For Uttarakhand Agricultural Supervisors
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => {
          setIsForgotOpen(false);
          setResetError('');
          setResetSuccess('');
        }}
        title="Reset Account Password"
        footer={
          <Button variant="ghost" onClick={() => {
            setIsForgotOpen(false);
            setResetError('');
            setResetSuccess('');
          }}>
            Close
          </Button>
        }
      >
        <form onSubmit={handleResetSubmit} className="flex flex-col gap-4 text-left">
          <p className="text-xs text-gray-400 leading-relaxed mb-1">
            Please enter your registered email and full name to verify your identity and set a new password.
          </p>

          {resetError && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
              {resetError}
            </div>
          )}

          {resetSuccess && (
            <div className="p-3 bg-green-900/20 border border-green-500/30 text-green-400 text-xs rounded-xl text-center">
              {resetSuccess}
            </div>
          )}

          {/* Email */}
          <Input
            id="reset-email"
            type="email"
            name="email"
            label="Email Address"
            value={resetForm.email}
            onChange={handleResetFormChange}
            required
            placeholder="supervisor@agri.uk.gov.in"
            icon={<Mail size={15} />}
          />

          {/* Full Name */}
          <Input
            id="reset-name"
            type="text"
            name="name"
            label="Full Name"
            value={resetForm.name}
            onChange={handleResetFormChange}
            required
            placeholder="Osman"
            icon={<User size={15} />}
          />

          {/* New Password */}
          <Input
            id="reset-password"
            type="password"
            name="new_password"
            label="New Password"
            value={resetForm.new_password}
            onChange={handleResetFormChange}
            required
            placeholder="••••••••"
            icon={<Lock size={15} />}
          />

          <Button
            id="reset-submit-btn"
            type="submit"
            isLoading={resetLoading}
            className="w-full justify-center py-2.5 mt-2 text-sm"
          >
            Reset Password
          </Button>
        </form>
      </Modal>
    </div>
  );
}
