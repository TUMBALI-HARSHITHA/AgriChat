import { Link } from 'react-router-dom';
import { MessageSquareText, ArrowRight, Leaf, Shield, Zap } from 'lucide-react';

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
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl animate-fadeInUp delay-200">
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

        {/* ── Highlighted Chat Preview ── */}
        <div className="w-full flex justify-center items-center animate-fadeInUp delay-300">
          <div className="relative animate-float w-full max-w-[340px] px-2">

            {/* card */}
            <div className="glass rounded-3xl p-6 w-full glow-green">

              {/* header */}
              <div className="flex items-center gap-3 mb-5 text-left">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shrink-0">
                  <MessageSquareText size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AgriChat AI</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    Online
                  </p>
                </div>
              </div>

              {/* user bubble */}
              <div className="mb-4 text-left">
                <div className="chat-bubble-user px-4 py-2.5 text-sm text-white ml-10">
                  My beans have yellow spots. What should I do?
                </div>
                <p className="text-xs text-gray-600 text-right mt-1">Supervisor</p>
              </div>

              {/* ai bubble */}
              <div className="mb-4 text-left">
                <div className="chat-bubble-ai px-4 py-2.5 text-sm text-gray-200 mr-10">
                  Yellow spots may indicate{' '}
                  <span className="text-green-400 font-medium">bean rust</span> or nutrient
                  deficiency. Try a copper-based fungicide spray…
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-1">AgriChat AI</p>
              </div>

              {/* disclaimer chip */}
              <div className="p-2.5 rounded-xl bg-amber-900/20 border border-amber-800/20 text-left">
                <p className="text-xs text-amber-400/80 leading-relaxed">
                  ⚠️ Verify with a licensed extension officer before applying.
                </p>
              </div>
            </div>

            {/* floating tags */}
            <div className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-1.5 text-xs font-semibold text-green-300 border border-green-600/30 whitespace-nowrap">
              🌿 Uttarakhand Crops
            </div>
            <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-700/30 whitespace-nowrap">
              🤖 Gemini AI
            </div>
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
