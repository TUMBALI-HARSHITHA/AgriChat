import Hero from '../components/Hero';
import Card from '../components/Card';
import { Sprout, Bug, Cloud, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    image: <Sprout size={32} className="text-green-400" />,
    tag: 'Crop Health',
    tagColor: 'green',
    title: 'Diagnose Crop Diseases Instantly',
    description:
      'Describe your crop issue in simple language and get AI-powered diagnosis with remedies tailored to Uttarakhand conditions.',
    actionLabel: 'Try it now',
    actionLink: '/chat',
    variant: 'highlight',
  },
  {
    image: <Bug size={32} className="text-amber-400" />,
    tag: 'Pest Control',
    tagColor: 'amber',
    title: 'Pest Management Guidance',
    description:
      'Targeted pest control advice for mountain crops — rajma, wheat, potato, millets — with organic and chemical options.',
    actionLabel: 'Ask a question',
    actionLink: '/chat',
    variant: 'default',
  },
  {
    image: <Cloud size={32} className="text-blue-400" />,
    tag: 'Seasonal Tips',
    tagColor: 'blue',
    title: 'Weather & Seasonal Planning',
    description:
      "Context-aware advice based on Uttarakhand's Kharif and Rabi seasons, altitude zones, and local climate patterns.",
    actionLabel: 'Explore',
    actionLink: '/chat',
    variant: 'default',
  },
  {
    image: <BookOpen size={32} className="text-purple-400" />,
    tag: 'Knowledge Base',
    tagColor: 'purple',
    title: 'Uttarakhand Crop Encyclopedia',
    description:
      'Curated knowledge of 50+ mountain crops, traditional farming techniques, and government extension resources.',
    actionLabel: 'Learn more',
    actionLink: '/about',
    variant: 'default',
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <Hero />

      {/* ── Features ── */}
      <section id="features" className="py-28 sm:py-36 flex flex-col items-center w-full">
        <div className="max-w-5xl w-full px-6 sm:px-10 lg:px-16 flex flex-col items-center gap-y-14 md:gap-y-28">

          {/* Header and Grid Group */}
          <div className="flex flex-col gap-y-12">
            {/* section header */}
            <div className="text-center animate-fadeInUp">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">
                What AgriChat offers
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Everything a mountain farmer needs
              </h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                Purpose-built for Uttarakhand's unique agri-ecosystem — from high-altitude crops to monsoon challenges.
              </p>
            </div>

            {/* cards grid — 1 col → 2 col → 4 col (centered) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 justify-items-center justify-center">
              {features.map((f, i) => <Card key={i} {...f} />)}
            </div>
          </div>

          {/* CTA strip (fully centered) */}
          <div className="rounded-2xl bg-gradient-to-r from-green-900/40 to-[#111a11] border border-green-700/20 p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-6 max-w-3xl mx-auto w-full">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Ready to ask your first question?
              </h3>
              <p className="text-gray-400 text-sm">No signup needed. Just type and get answers.</p>
            </div>
            <Link to="/chat" className="btn-primary shrink-0">
              Open Chat <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
