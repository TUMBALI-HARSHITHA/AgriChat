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
  },
  {
    image: '🥔',
    tag: 'Pest Control',
    tagColor: 'amber',
    title: 'Late blight in potato crop',
    description: 'Asked yesterday — Recommended copper-based fungicide (Bordeaux mixture) and improved drainage.',
    actionLabel: 'View full answer',
    actionLink: '/chat',
  },
  {
    image: '🌾',
    tag: 'Planning',
    tagColor: 'green',
    title: 'Rabi wheat sowing window',
    description: 'Asked 3 days ago — Optimal window: Oct 15–Nov 5 for mid-Himalayan zones above 1200m.',
    actionLabel: 'Ask follow-up',
    actionLink: '/chat',
  },
];

const quickStats = [
  { icon: <MessageSquareText size={20} />, label: 'Total Queries', value: '24', color: 'green' },
  { icon: <Leaf              size={20} />, label: 'Crops Covered', value: '8',  color: 'blue'  },
  { icon: <TrendingUp        size={20} />, label: 'This Week',     value: '7',  color: 'purple'},
  { icon: <AlertCircle       size={20} />, label: 'Disease Alerts',value: '2',  color: 'amber' },
];

const colorMap = {
  green:  'bg-green-900/30  border-green-700/20  text-green-400',
  blue:   'bg-blue-900/30   border-blue-700/20   text-blue-400',
  purple: 'bg-purple-900/30 border-purple-700/20 text-purple-400',
  amber:  'bg-amber-900/30  border-amber-700/20  text-amber-400',
};

export default function Dashboard() {
  return (
    <div className="min-h-screen page-enter" style={{ paddingTop: '120px', paddingBottom: '96px' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-14 text-center sm:text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, Supervisor. Here's your advisory overview.</p>
          </div>
          <Link to="/chat" className="btn-primary shrink-0">
            <MessageSquareText size={16} />
            New Query
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {quickStats.map(s => (
            <div
              key={s.label}
              className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border ${colorMap[s.color]}`}
            >
              <div className="opacity-80 shrink-0">{s.icon}</div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white leading-none">{s.value}</p>
                <p className="text-xs opacity-70 mt-0.5 truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Queries ── */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-green-400 shrink-0" />
              Recent Queries
            </h2>
            <Link to="/chat" className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 shrink-0">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {/* cards — 1 col → 3 col */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {recentQueries.map((q, i) => <Card key={i} {...q} />)}
          </div>
        </div>

        {/* ── Tip strip ── */}
        <div className="rounded-2xl bg-gradient-to-r from-green-900/30 to-[#111a11] border border-green-700/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1">💡 Seasonal Tip</p>
            <h3 className="text-base font-bold text-white mb-1">
              Monsoon retreat — protect stored grains from humidity
            </h3>
            <p className="text-sm text-gray-500">
              Post-Kharif storage: ensure moisture content below 12% for wheat and rajma before bagging.
            </p>
          </div>
          <Link to="/chat" className="btn-secondary shrink-0 text-sm">
            Ask about storage
          </Link>
        </div>

      </div>
    </div>
  );
}
