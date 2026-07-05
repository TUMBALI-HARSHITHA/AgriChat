import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, User } from 'lucide-react';
import { Button, Input, Modal } from '../components/ui';
import { API_BASE_URL } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
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
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-green-900/30" />
          </div>

          {/* guest CTA */}
          <Button
            variant="secondary"
            className="w-full justify-center py-3 text-sm"
            onClick={() => navigate('/chat')}
          >
            Try without login <ArrowRight size={14} className="ml-1.5" />
          </Button>

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
