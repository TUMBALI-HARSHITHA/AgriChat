import { Link } from 'react-router-dom';
import { MessageSquareText, ArrowRight, Leaf, Shield, Zap, Sprout } from 'lucide-react';

const stats = [
  { icon: <Leaf  size={15} />, label: 'Mountain Crops', value: '50+' },
  { icon: <Shield size={15} />, label: 'Verified Advice', value: '100%' },
  { icon: <Zap   size={15} />, label: 'Instant AI',      value: 'Free' },
];

export default function Hero({ headline, subheadline, ctaText, ctaLink }) {
  return (
    <section className="relative min-h-screen flex items-center hero-bg overflow-hidden" style={{ paddingTop: '64px' }}>

      {/* subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(74,222,128,1) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,1) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* glow orbs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/5 w-52 h-52 bg-amber-500/06 rounded-full blur-3xl pointer-events-none" />

      {/* ── centered container ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 flex flex-col items-center text-center gap-12">

        {/* ── Text Content Block ── */}
        <div className="flex flex-col items-center gap-6 max-w-3xl">

          {/* leaf logo box */}
          <div className="flex justify-center mb-1 animate-fadeInUp">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center glow-green shrink-0">
              <Sprout size={28} className="text-white" />
            </div>
          </div>

          {/* badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/40 border border-green-700/30 text-green-400 text-xs font-semibold uppercase tracking-wider animate-fadeInUp">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI Agricultural Advisory
          </span>

          {/* headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-white animate-fadeInUp delay-100">
            {headline ?? (
              <>
                Smart Farming{' '}
                <span className="gradient-text">Advice</span>
                {' '}for Uttarakhand
              </>
            )}
          </h1>

          {/* sub */}
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto animate-fadeInUp delay-200">
            {subheadline ??
              "Ask any farming question in plain language. Get instant, practical guidance tailored to Uttarakhand's mountain crops — from disease diagnosis to seasonal planting."}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 animate-fadeInUp delay-300">
            <Link to={ctaLink ?? '/chat'} className="btn-primary">
              <MessageSquareText size={17} />
              {ctaText ?? 'Start Chatting'}
              <ArrowRight size={15} />
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>

          {/* stats */}
          <div className="flex flex-wrap justify-center gap-6 pt-2 animate-fadeInUp delay-400">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-900/50 border border-green-700/30 flex items-center justify-center text-green-400 shrink-0">
                  {s.icon}
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-white leading-none">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-600 animate-bounce">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-green-600/40 to-transparent" />
      </div>
    </section>
  );
}
