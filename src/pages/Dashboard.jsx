import { Link } from 'react-router-dom';
import { MessageSquareText, Leaf, TrendingUp, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import Card from '../components/Card';

const recentQueries = [
  {
    image: '🫘',
    tag: 'Disease',
    tagColor: 'red',
    title: 'Bean yellow mosaic treatment',
    description: 'Asked 2 hours ago — Aphid-transmitted viral disease. Recommended: remove infected plants, apply neem oil spray.',
    actionLabel: 'Continue chat',
    actionLink: '/chat',
    variant: 'default',
  },
  {
    image: '🥔',
    tag: 'Pest Control',
    tagColor: 'amber',
    title: 'Late blight in potato crop',
    description: 'Asked yesterday — Recommended copper-based fungicide (Bordeaux mixture) and improved drainage.',
    actionLabel: 'View full answer',
    actionLink: '/chat',
    variant: 'default',
  },
  {
    image: '🌾',
    tag: 'Planning',
    tagColor: 'green',
    title: 'Rabi wheat sowing window',
    description: 'Asked 3 days ago — Optimal window: Oct 15–Nov 5 for mid-Himalayan zones above 1200m.',
    actionLabel: 'Ask follow-up',
    actionLink: '/chat',
    variant: 'default',
  },
];

const quickStats = [
  { icon: <MessageSquareText size={20} />, label: 'Total Queries', value: '24', color: 'green' },
  { icon: <Leaf size={20} />, label: 'Crops Covered', value: '8', color: 'blue' },
  { icon: <TrendingUp size={20} />, label: 'This Week', value: '7', color: 'purple' },
  { icon: <AlertCircle size={20} />, label: 'Disease Alerts', value: '2', color: 'amber' },
];

const colorMap = {
  green: 'bg-green-900/30 border-green-700/20 text-green-400',
  blue: 'bg-blue-900/30 border-blue-700/20 text-blue-400',
  purple: 'bg-purple-900/30 border-purple-700/20 text-purple-400',
  amber: 'bg-amber-900/30 border-amber-700/20 text-amber-400',
};

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, Supervisor. Here's your advisory overview.</p>
          </div>
          <Link to="/chat" className="btn-primary">
            <MessageSquareText size={16} />
            New Query
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl p-5 border ${colorMap[stat.color]} flex items-center gap-4`}
            >
              <div className="opacity-80">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs opacity-70">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Queries */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Clock size={18} className="text-green-400" />
              Recent Queries
            </h2>
            <Link to="/chat" className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {recentQueries.map((q, idx) => (
              <Card key={idx} {...q} />
            ))}
          </div>
        </div>

        {/* Quick tip box */}
        <div className="rounded-2xl bg-gradient-to-r from-green-900/30 to-[#111a11] border border-green-700/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1">💡 Seasonal Tip</div>
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Monsoon retreat — protect stored grains from humidity
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Post-Kharif storage: ensure moisture content below 12% for wheat and rajma before bagging.
            </p>
          </div>
          <Link to="/chat" className="btn-secondary whitespace-nowrap text-sm">
            Ask about storage
          </Link>
        </div>
      </div>
    </div>
  );
}
