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
      'Tailored specifically for mountain crops, altitude zones, and Uttarakhand's local growing conditions.',
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
    <div className="min-h-screen page-enter" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mx-auto mb-5 glow-green">
            <Sprout size={28} className="text-white" />
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
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12 border border-green-900/30">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            Uttarakhand's mountain agriculture faces unique challenges — steep terrain, erratic rainfall,
            limited access to experts, and diverse microclimates. AgriChat bridges the gap between
            modern AI and traditional farming knowledge, giving every supervisor instant access to
            expert guidance tailored to their specific region, crop, and season.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {teamCards.map((c, i) => <Card key={i} {...c} />)}
        </div>

        {/* ── Core Principles ── */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Core Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {values.map(v => (
            <div
              key={v.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-[#111a11] border border-green-900/20 hover:border-green-700/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-green-900/40 border border-green-700/20 flex items-center justify-center text-green-400 shrink-0">
                {v.icon}
              </div>
              <div>
                <p className="font-semibold text-white mb-1">{v.title}</p>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Disclaimer ── */}
        <div className="rounded-2xl bg-amber-900/10 border border-amber-800/20 p-5 sm:p-6 mb-12">
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
