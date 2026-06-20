import { Link } from 'react-router-dom';
import { Sprout, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Chat', path: '/chat' },
    { label: 'About', path: '/about' },
    { label: 'Login', path: '/login' },
  ],
  Resources: [
    { label: 'Crop Guide', path: '#', external: false },
    { label: 'Disease Index', path: '#', external: false },
    { label: 'Uttarakhand Agri Dept', path: 'https://agriculture.uk.gov.in', external: true },
  ],
  Legal: [
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Use', path: '#' },
    { label: 'Disclaimer', path: '#' },
  ],
};

const socialLinks = [
  { icon: <Github size={16} />, href: '#', label: 'GitHub' },
  { icon: <Twitter size={16} />, href: '#', label: 'Twitter/X' },
  { icon: <Linkedin size={16} />, href: '#', label: 'LinkedIn' },
  { icon: <Mail size={16} />, href: 'mailto:hello@agrichat.in', label: 'Email' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080d08] border-t border-green-900/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sprout size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white font-['Plus_Jakarta_Sans']">
                Agri<span className="text-green-400">Chat</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              AI-powered agricultural advisory tailored for Uttarakhand's mountain farmers. Get practical, instant crop guidance in plain language.
            </p>

            {/* Disclaimer box */}
            <div className="p-3 rounded-xl bg-amber-900/10 border border-amber-800/20">
              <p className="text-xs text-amber-500/80 leading-relaxed">
                ⚠️ <strong className="text-amber-400">Disclaimer:</strong> All responses are AI-generated suggestions. Always verify critical decisions with a licensed agricultural extension officer.
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-green-400 transition-colors duration-200"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm text-gray-500 hover:text-green-400 transition-colors duration-200"
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

        {/* Bottom bar */}
        <div className="py-5 border-t border-green-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            © {currentYear} AgriChat. Made with{' '}
            <Heart size={12} className="text-red-500 fill-red-500" /> for Uttarakhand farmers.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-green-900/20 border border-green-900/30 flex items-center justify-center text-gray-500 hover:text-green-400 hover:border-green-700/40 hover:bg-green-900/30 transition-all duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Powered by badge */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Powered by</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-900/20 border border-blue-800/20 text-blue-400 font-semibold text-xs">
              Gemini AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
