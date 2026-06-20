import { Sprout, Target, Users, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const teamCards = [
  {
    image: '🧑‍🌾',
    tag: 'Audience',
    tagColor: 'green',
    title: 'For Field Supervisors',
    description:
      'Designed for Uttarakhand agricultural supervisors who need quick, reliable answers without internet research barriers.',
  },
  {
    image: '🔬',
    tag: 'Technology',
    tagColor: 'blue',
    title: 'AI-Powered Intelligence',
    description:
      'Powered by Google Gemini with domain constraints to stay focused on practical agricultural advice.',
  },
  {
    image: '🏔️',
    tag: 'Region',
    tagColor: 'purple',
    title: 'Uttarakhand Focus',
    description:
      "Tailored specifically for mountain crops, altitude zones, and Uttarakhand's local growing conditions.",
    variant: 'highlight',
  },
];

const values = [
  {
    icon: <Target size={20} />,
    title: 'Purpose-Built',
    desc: 'Focused only on agricultural advisory — not a general-purpose chatbot.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Safety First',
    desc: 'Every response carries a disclaimer to consult extension officers.',
  },
  {
    icon: <Users size={20} />,
    title: 'Farmer-Centric',
    desc: 'Plain language, no jargon — designed for supervisors in the field.',
  },
  {
    icon: <Cpu size={20} />,
    title: 'Gemini API',
    desc: "Google's Gemini free-tier powers fast, reliable, accurate responses.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen w-full page-enter flex flex-col items-center" style={{ paddingTop: '120px', paddingBottom: '96px' }}>
      <div className="max-w-5xl w-full px-6 sm:px-10 lg:px-16 flex flex-col items-center gap-y-14 md:gap-y-28">

        {/* ── Page header ── */}
        <div className="text-center flex flex-col items-center w-full">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center glow-green shrink-0">
              <Sprout size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            About <span className="gradient-text">AgriChat</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            AgriChat is an AI-powered agricultural advisory platform built specifically for supervisors
            and farmers in Uttarakhand's mountain regions.
          </p>
        </div>

        {/* ── Mission ── */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-green-900/30 text-center w-full max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            Uttarakhand's mountain agriculture faces unique challenges — steep terrain, erratic rainfall,
            limited access to experts, and diverse microclimates. AgriChat bridges the gap between
            modern AI and traditional farming knowledge, giving every supervisor instant access to
            expert guidance tailored to their specific region, crop, and season.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 lg:gap-14 w-full justify-items-center justify-center">
          {teamCards.map((c, i) => <Card key={i} {...c} />)}
        </div>

        {/* ── Core Principles ── */}
        <div className="w-full flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-12 text-center">Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 w-full justify-items-center justify-center">
            {values.map(v => (
              <div
                key={v.title}
                className="flex flex-col items-center text-center gap-5 p-6 sm:p-8 rounded-xl bg-[#111a11] border border-green-900/20 hover:border-green-700/30 transition-colors w-full max-w-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-green-900/40 border border-green-700/20 flex items-center justify-center text-green-400 shrink-0">
                  {v.icon}
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{v.title}</p>
                  <p className="text-sm text-gray-400">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="rounded-2xl bg-amber-900/10 border border-amber-800/20 p-6 sm:p-8 text-center w-full max-w-4xl mx-auto">
          <h3 className="text-base font-bold text-amber-400 mb-2">⚠️ Important Disclaimer</h3>
          <p className="text-sm text-amber-500/80 leading-relaxed">
            All responses provided by AgriChat are AI-generated and intended for informational purposes
            only. Always verify with a{' '}
            <strong className="text-amber-400">licensed agricultural extension officer</strong>{' '}
            before making significant farming decisions involving pesticides, fertilizers, or financial investments.
          </p>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <Link to="/chat" className="btn-primary">
            Start Chatting <ArrowRight size={17} />
          </Link>
        </div>

      </div>
    </div>
  );
}
