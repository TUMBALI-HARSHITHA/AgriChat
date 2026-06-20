import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, MessageSquareText, User, Bell } from 'lucide-react';

const navLinks = [
  { label: 'Home',      path: '/' },
  { label: 'Chat',      path: '/chat' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'About',     path: '/about' },
  { label: 'Login',     path: '/login' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 glass border-b border-green-900/30"
      style={{ height: '64px' }}
    >
      {/* ── inner container ── */}
      <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="AgriChat home">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center glow-green-sm shrink-0">
            <Sprout size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white leading-none">
            Agri<span className="text-green-400">Chat</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                pathname === path
                  ? 'bg-green-800/40 text-green-300 border border-green-600/30'
                  : 'text-gray-400 hover:text-green-300 hover:bg-green-900/20',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop icons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-lg border border-green-800/30 bg-green-900/20 flex items-center justify-center text-gray-400 hover:text-green-300 transition-colors"
          >
            <Bell size={16} />
          </button>
          <Link
            to="/chat"
            aria-label="Open chat"
            className="w-9 h-9 rounded-lg border border-green-800/30 bg-green-900/20 flex items-center justify-center text-gray-400 hover:text-green-300 transition-colors"
          >
            <MessageSquareText size={16} />
          </Link>
          <Link
            to="/login"
            aria-label="Profile"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white hover:scale-105 transition-transform glow-green-sm"
          >
            <User size={16} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden w-9 h-9 rounded-lg border border-green-800/30 bg-green-900/20 flex items-center justify-center text-gray-400 hover:text-green-300 transition-colors"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={[
          'md:hidden overflow-hidden transition-all duration-300 border-t border-green-900/30',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="px-4 py-3 space-y-1 bg-[#0a0f0a]/95">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={[
                'block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200',
                pathname === path
                  ? 'bg-green-800/40 text-green-300 border border-green-600/30'
                  : 'text-gray-400 hover:text-green-300 hover:bg-green-900/20',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}

          {/* Bottom action row */}
          <div className="flex gap-2 pt-2">
            <Link
              to="/chat"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium flex items-center justify-center gap-2"
            >
              <MessageSquareText size={14} /> Chat
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 rounded-lg border border-green-700/40 bg-green-900/20 text-green-300 text-sm font-medium flex items-center justify-center gap-2"
            >
              <User size={14} /> Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
