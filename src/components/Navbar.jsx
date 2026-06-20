import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, MessageSquareText, User, Bell } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Chat', path: '/chat' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'About', path: '/about' },
  { label: 'Login', path: '/login' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-green-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="AgriChat Home"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-green-sm">
              <Sprout size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white font-['Plus_Jakarta_Sans']">
              Agri<span className="text-green-400">Chat</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-green-700/30 text-green-300 border border-green-600/30'
                    : 'text-gray-400 hover:text-green-300 hover:bg-green-900/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-lg bg-green-900/20 border border-green-800/30 flex items-center justify-center text-gray-400 hover:text-green-300 hover:border-green-600/40 transition-all duration-200"
            >
              <Bell size={16} />
            </button>
            <Link
              to="/chat"
              aria-label="Open Chat"
              className="w-9 h-9 rounded-lg bg-green-900/20 border border-green-800/30 flex items-center justify-center text-gray-400 hover:text-green-300 hover:border-green-600/40 transition-all duration-200"
            >
              <MessageSquareText size={16} />
            </Link>
            <Link
              to="/login"
              aria-label="Profile"
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white hover:scale-105 transition-transform duration-200 glow-green-sm"
            >
              <User size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            className="md:hidden w-9 h-9 rounded-lg bg-green-900/20 border border-green-800/30 flex items-center justify-center text-gray-400 hover:text-green-300 transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 border-t border-green-900/30">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-green-700/30 text-green-300 border border-green-600/30'
                  : 'text-gray-400 hover:text-green-300 hover:bg-green-900/20'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <button
              aria-label="Notifications mobile"
              className="flex-1 py-2.5 rounded-lg bg-green-900/20 border border-green-800/30 text-gray-400 text-sm flex items-center justify-center gap-2 hover:text-green-300 transition-all"
            >
              <Bell size={14} /> Alerts
            </button>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <User size={14} /> Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
