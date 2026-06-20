import { Link } from 'react-router-dom';
import { Sprout, Globe, Share2, Link as LinkIcon, Mail, Heart } from 'lucide-react';

const NAV = {
  Product: [
    { label: 'Home',      to: '/' },
    { label: 'Chat',      to: '/chat' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'About',     to: '/about' },
    { label: 'Login',     to: '/login' },
  ],
  Resources: [
    { label: 'Crop Guide',          to: '#' },
    { label: 'Disease Index',        to: '#' },
    { label: 'UK Agri Department',   href: 'https://agriculture.uk.gov.in' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Use',   to: '#' },
    { label: 'Disclaimer',     to: '#' },
  ],
};

const SOCIALS = [
  { icon: <Globe   size={15} />, href: '#',                        label: 'Website'  },
  { icon: <Share2  size={15} />, href: '#',                        label: 'Social'   },
  { icon: <LinkIcon size={15}/>, href: '#',                        label: 'LinkedIn' },
  { icon: <Mail    size={15} />, href: 'mailto:hello@agrichat.in', label: 'Email'    },
];

export default function Footer() {
  return (
    <footer className="bg-[#080d08] border-t border-green-900/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* ── top grid ── */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* brand */}
          <div className="sm:col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Sprout size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Agri<span className="text-green-400">Chat</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5 mx-auto sm:mx-0">
              AI-powered agricultural advisory for Uttarakhand's mountain farmers. Get practical crop guidance in plain language.
            </p>

            <div className="rounded-xl bg-amber-900/10 border border-amber-800/20 p-3 max-w-xs sm:max-w-none mx-auto sm:mx-0">
              <p className="text-xs text-amber-500/80 leading-relaxed">
                <strong className="text-amber-400">Disclaimer:</strong>{' '}
                All responses are AI-generated. Always verify with a licensed agricultural extension officer.
              </p>
            </div>
          </div>

          {/* link columns */}
          {Object.entries(NAV).map(([section, links]) => (
            <div key={section} className="text-center sm:text-left">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-green-400 transition-colors"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-gray-500 hover:text-green-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── bottom bar ── */}
        <div className="py-5 border-t border-green-900/20 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} AgriChat. Made with{' '}
            <Heart size={11} className="text-red-500 fill-red-500" /> for Uttarakhand farmers.
          </p>

          <div className="flex items-center gap-2">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-green-900/20 border border-green-900/30 flex items-center justify-center text-gray-500 hover:text-green-400 hover:bg-green-900/30 hover:border-green-700/40 transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
            Powered by
            <span className="px-2 py-0.5 rounded-md bg-blue-900/20 border border-blue-800/20 text-blue-400 font-semibold">
              Gemini AI
            </span>
          </span>
        </div>

      </div>
    </footer>
  );
}
