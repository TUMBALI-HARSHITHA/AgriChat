import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquareText, Leaf, TrendingUp, AlertCircle, ArrowRight, Clock, Sprout } from 'lucide-react';
import Card from '../components/Card';
import { Button, Modal } from '../components/ui';

const recentQueries = [
  {
    image: '🫘',
    tag: 'Disease',
    tagColor: 'red',
    title: 'Bean yellow mosaic treatment',
    description: 'Asked 2 hours ago — Aphid-transmitted viral disease. Recommended: remove infected plants, apply neem oil spray.',
    actionLabel: 'View details',
    details: {
      symptoms: 'Yellow mosaic patterns, leaf curling, and stunted growth in beans (Rajma).',
      cause: 'Aphid-transmitted Bean Yellow Mosaic Virus (BYMV).',
      treatment: [
        'Uproot and destroy heavily infected plants immediately to prevent spread.',
        'Spray neem oil (2-3 ml per litre of water) to control aphid vector population.',
        'Use disease-resistant certified seeds for subsequent sowing seasons.',
        'Maintain weed-free boundaries as weeds act as alternate hosts for aphids.'
      ],
      safetyWarning: 'Do not use chemical insecticides during active pollinator hours to protect honeybees.'
    }
  },
  {
    image: '🥔',
    tag: 'Pest Control',
    tagColor: 'amber',
    title: 'Late blight in potato crop',
    description: 'Asked yesterday — Recommended copper-based fungicide (Bordeaux mixture) and improved drainage.',
    actionLabel: 'View details',
    details: {
      symptoms: 'Water-soaked purplish-brown lesions on leaves, white cottony growth on the underside under high humidity.',
      cause: 'Phytophthora infestans (fungus-like oomycete pathogen).',
      treatment: [
        'Apply Bordeaux mixture (1%) or Copper Oxychloride (3g/L of water) as a preventative spray.',
        'Improve drainage in the potato field beds; water stagnation accelerates spore multiplication.',
        'Avoid overhead sprinkler irrigation; prefer furrow/drip irrigation to keep leaves dry.',
        'Destroy infected haulms (stems/leaves) 10 days before harvesting tubers.'
      ],
      safetyWarning: 'Apply fungicide treatments on dry wind-free mornings for optimal leaf absorption.'
    }
  },
  {
    image: '🌾',
    tag: 'Planning',
    tagColor: 'green',
    title: 'Rabi wheat sowing window',
    description: 'Asked 3 days ago — Optimal window: Oct 15–Nov 5 for mid-Himalayan zones above 1200m.',
    actionLabel: 'View details',
    details: {
      symptoms: 'Query regarding regional sowing schedule and soil preparation tips.',
      cause: 'Seasonal calendar planning advice for mid-Himalayan region.',
      treatment: [
        'Optimal sowing window: October 15 to November 5 for heights above 1200m (cool mountain climate).',
        'Incorporate well-decomposed Farm Yard Manure (FYM) or compost at 10-12 tonnes/hectare during final tillage.',
        'Treat seed with Azotobacter and PSB cultures (20g each per kg seed) to enhance nutrient availability.',
        'Maintain sowing depth of 4-5 cm with row spacing of 20-22 cm.'
      ],
      safetyWarning: 'Late sowing after late November reduces grain yield by 1-1.5% per day due to early summer heat.'
    }
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
  const navigate = useNavigate();
  const [selectedQuery, setSelectedQuery] = useState(null);

  return (
    <div className="min-h-screen w-full page-enter flex flex-col items-center" style={{ paddingTop: '120px', paddingBottom: '96px' }}>
      <div className="max-w-5xl w-full px-6 sm:px-10 lg:px-16 flex flex-col items-center gap-y-14 md:gap-y-28">

        {/* ── Page header ── */}
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full">
          <div className="flex justify-center mb-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center glow-green shrink-0">
              <Sprout size={28} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, Supervisor. Here's your advisory overview.</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/chat')} className="shrink-0">
            <MessageSquareText size={16} className="mr-1.5" />
            New Query
          </Button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center justify-center">
          {quickStats.map(s => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center text-center gap-2 p-4 sm:p-5 rounded-xl border w-full max-w-[240px] ${colorMap[s.color]}`}
            >
              <div className="opacity-80 shrink-0">{s.icon}</div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white leading-none">{s.value}</p>
                <p className="text-xs opacity-70 mt-1.5 truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Queries ── */}
        <div className="flex flex-col gap-y-8 w-full">
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <Clock size={18} className="text-green-400 shrink-0" />
              Recent Queries
            </h2>
            <Link to="/chat" className="text-sm text-green-400 hover:text-green-300 flex items-center justify-center gap-1 shrink-0">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {/* cards — 1 col → 3 col (centered) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-items-center justify-center">
            {recentQueries.map((q, i) => (
              <Card 
                key={i} 
                {...q} 
                onClick={() => setSelectedQuery(q)}
              />
            ))}
          </div>
        </div>

        {/* ── Tip strip ── */}
        <div className="rounded-2xl bg-gradient-to-r from-green-900/30 to-[#111a11] border border-green-700/20 p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-6 max-w-3xl mx-auto w-full">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">💡 Seasonal Tip</p>
            <h3 className="text-base font-bold text-white mb-2">
              Monsoon retreat — protect stored grains from humidity
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Post-Kharif storage: ensure moisture content below 12% for wheat and rajma before bagging.
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/chat')} className="shrink-0 text-sm">
            Ask about storage
          </Button>
        </div>

      </div>

      {/* Detailed Query Advisory Modal */}
      <Modal
        isOpen={!!selectedQuery}
        onClose={() => setSelectedQuery(null)}
        title={selectedQuery ? `${selectedQuery.title} — Advisory Details` : 'Advisory Details'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedQuery(null)}>Close</Button>
            <Button variant="primary" onClick={() => { setSelectedQuery(null); navigate('/chat'); }}>
              <MessageSquareText size={15} className="mr-1.5" /> Continue to Chat
            </Button>
          </>
        }
      >
        {selectedQuery && (
          <div className="flex flex-col gap-5 text-left">
            {/* Header Badge */}
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">{selectedQuery.image}</span>
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border 
                  ${selectedQuery.tagColor === 'red' ? 'bg-red-950/40 text-red-400 border-red-800/30' : ''}
                  ${selectedQuery.tagColor === 'amber' ? 'bg-amber-950/40 text-amber-400 border-amber-800/30' : ''}
                  ${selectedQuery.tagColor === 'green' ? 'bg-green-950/40 text-green-400 border-green-800/30' : ''}
                `}>
                  {selectedQuery.tag}
                </span>
                <p className="text-xs text-gray-500 mt-2">{selectedQuery.description.split(' — ')[0]}</p>
              </div>
            </div>

            <div className="h-px bg-green-900/20" />

            {/* Diagnostic Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white mb-1">Symptoms / Inquiry:</h4>
                <p className="text-gray-300">{selectedQuery.details.symptoms}</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Root Cause / Context:</h4>
                <p className="text-gray-300">{selectedQuery.details.cause}</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Recommended Action Steps:</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  {selectedQuery.details.treatment.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-900/10 border border-amber-800/20 text-amber-500">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{selectedQuery.details.safetyWarning}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
