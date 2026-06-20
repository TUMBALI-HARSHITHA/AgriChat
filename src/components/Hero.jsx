import { Link } from 'react-router-dom';
import { MessageSquareText, ArrowRight, Leaf, Shield, Zap } from 'lucide-react';

const stats = [
  { icon: <Leaf size={16} />, label: 'Mountain Crops', value: '50+' },
  { icon: <Shield size={16} />, label: 'Verified Advice', value: '100%' },
  { icon: <Zap size={16} />, label: 'Instant Answers', value: 'AI' },
];

export default function Hero({ headline, subheadline, ctaText, ctaLink, imageSrc }) {
  return (
    <section className="relative min-h-screen flex items-center hero-bg overflow-hidden pt-16">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/6 w-48 h-48 bg-amber-500/08 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/40 border border-green-700/30 text-green-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fadeInUp">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Agricultural Advisory
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight font-['Plus_Jakarta_Sans'] mb-6 animate-fadeInUp delay-100">
              {headline || (
                <>
                  Smart Farming{' '}
                  <span className="gradient-text">Advice</span>
                  {' '}for Uttarakhand
                </>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg animate-fadeInUp delay-200">
              {subheadline ||
                "Ask any farming question in plain language. Get instant, practical guidance tailored to Uttarakhand's mountain crops — from disease diagnosis to seasonal planting."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 animate-fadeInUp delay-300">
              <Link to={ctaLink || '/chat'} className="btn-primary">
                <MessageSquareText size={18} />
                {ctaText || 'Start Chatting'}
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 animate-fadeInUp delay-400">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-900/50 border border-green-700/30 flex items-center justify-center text-green-400">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white leading-none">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual */}
          <div className="relative hidden lg:flex justify-center items-center animate-fadeInUp delay-300">
            <div className="relative animate-float">
              {/* Main card */}
              <div className="glass rounded-3xl p-6 w-80 glow-green">
                {/* Mock chat preview */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <MessageSquareText size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">AgriChat AI</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                      Online
                    </div>
                  </div>
                </div>

                {/* User message */}
                <div className="mb-3">
                  <div className="chat-bubble-user px-4 py-3 text-sm text-white ml-8 mb-1">
                    My beans have yellow spots. What should I do?
                  </div>
                  <div className="text-xs text-gray-600 text-right mr-1">Supervisor</div>
                </div>

                {/* AI response */}
                <div className="mb-3">
                  <div className="chat-bubble-ai px-4 py-3 text-sm text-gray-200 mr-8">
                    Yellow spots on beans may indicate <span className="text-green-400 font-medium">bean rust</span> or nutrient deficiency. Try a copper-based fungicide spray...
                  </div>
                  <div className="text-xs text-gray-600 mt-1 ml-1">AgriChat AI</div>
                </div>

                {/* Disclaimer chip */}
                <div className="mt-4 p-2.5 rounded-xl bg-amber-900/20 border border-amber-700/20">
                  <p className="text-xs text-amber-400/80 leading-relaxed">
                    ⚠️ Verify with a licensed extension officer before applying.
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-2 text-xs font-semibold text-green-300 border border-green-600/30">
                🌿 Uttarakhand Crops
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-3 py-2 text-xs font-semibold text-amber-300 border border-amber-700/30">
                🤖 Gemini AI
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-green-600/50 to-transparent" />
      </div>
    </section>
  );
}
