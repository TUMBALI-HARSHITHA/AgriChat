import Hero from '../components/Hero';
import Card from '../components/Card';
import { Sprout, Bug, Cloud, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    image: <Sprout />,
    tag: 'Crop Health',
    tagColor: 'green',
    title: 'Diagnose Crop Diseases Instantly',
    description:
      'Describe your crop issue in simple language and get AI-powered identification and remedies tailored to Uttarakhand conditions.',
    actionLabel: 'Try it now',
    actionLink: '/chat',
    variant: 'highlight',
  },
  {
    image: <Bug />,
    tag: 'Pest Control',
    tagColor: 'amber',
    title: 'Pest Management Guidance',
    description:
      'Get targeted pest control advice for mountain crops like rajma, wheat, potato, and millets with organic and chemical options.',
    actionLabel: 'Ask a question',
    actionLink: '/chat',
    variant: 'default',
  },
  {
    image: <Cloud />,
    tag: 'Seasonal Tips',
    tagColor: 'blue',
    title: 'Weather & Seasonal Planning',
    description:
      "Get context-aware advice based on Uttarakhand's Kharif and Rabi seasons, altitude zones, and local climate patterns.",
    actionLabel: 'Explore',
    actionLink: '/chat',
    variant: 'default',
  },
  {
    image: <BookOpen />,
    tag: 'Knowledge Base',
    tagColor: 'purple',
    title: 'Uttarakhand Crop Encyclopedia',
    description:
      'Access a curated knowledge base of 50+ mountain crops, traditional farming techniques, and government extension resources.',
    actionLabel: 'Learn more',
    actionLink: '/about',
    variant: 'default',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-14 animate-fadeInUp">
            <span className="inline-block text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">
              What AgriChat offers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] mb-4">
              Everything a mountain farmer needs
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Purpose-built for Uttarakhand's unique agri-ecosystem — from high-altitude crops to monsoon challenges.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, idx) => (
              <Card key={idx} {...feature} />
            ))}
          </div>

          {/* CTA strip */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-green-900/40 to-[#111a11] border border-green-700/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Ready to ask your first question?
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                No signup needed. Just type and get answers.
              </p>
            </div>
            <Link to="/chat" className="btn-primary whitespace-nowrap">
              Open Chat <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
