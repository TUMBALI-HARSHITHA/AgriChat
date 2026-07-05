import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, MessageSquareText, User, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('agrichat_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const logout = () => {
    localStorage.removeItem('agrichat_token');
    localStorage.removeItem('agrichat_user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const logoutMobile = () => {
    logout();
    setOpen(false);
  };

  const links = user 
    ? navLinks.filter(l => l.path !== '/login') 
    : navLinks;

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
          {links.map(({ label, path }) => (
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
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-green-800/30 bg-green-900/20 flex items-center justify-center text-gray-400 hover:text-green-300 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
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
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-green-300 bg-green-950/60 border border-green-800/50 px-2.5 py-1.5 rounded-xl">
                👤 {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg border border-red-700/40 bg-red-950/20 text-red-400 hover:bg-red-900/20 text-xs font-medium cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Profile"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white hover:scale-105 transition-transform glow-green-sm"
            >
              <User size={16} />
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-green-800/30 bg-green-900/20 flex items-center justify-center text-gray-400 hover:text-green-300 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="w-9 h-9 rounded-lg border border-green-800/30 bg-green-900/20 flex items-center justify-center text-gray-400 hover:text-green-300 transition-colors"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={[
          'md:hidden overflow-hidden transition-all duration-300 border-t border-green-900/30',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="px-4 py-3 space-y-1 bg-[#0a0f0a]/95">
          {links.map(({ label, path }) => (
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
            {user ? (
              <button
                onClick={logoutMobile}
                className="flex-1 py-2.5 rounded-lg border border-red-700/40 bg-red-950/20 text-red-400 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-lg border border-green-700/40 bg-green-900/20 text-green-300 text-sm font-medium flex items-center justify-center gap-2"
              >
                <User size={14} /> Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
