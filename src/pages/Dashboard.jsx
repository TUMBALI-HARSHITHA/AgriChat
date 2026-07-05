import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquareText, Leaf, TrendingUp, AlertCircle, ArrowRight, Clock, Sprout } from 'lucide-react';
import Card from '../components/Card';
import { Button, Modal } from '../components/ui';
import { API_BASE_URL } from '../config';

const colorMap = {
  green:  'bg-green-900/30  border-green-700/20  text-green-400',
  blue:   'bg-blue-900/30   border-blue-700/20   text-blue-400',
  purple: 'bg-purple-900/30 border-purple-700/20 text-purple-400',
  amber:  'bg-amber-900/30  border-amber-700/20  text-amber-400',
};

const getCropEmoji = (crop) => {
  if (!crop) return '🌱';
  const lower = crop.toLowerCase();
  if (lower.includes('potato')) return '🥔';
  if (lower.includes('wheat')) return '🌾';
  if (lower.includes('bean') || lower.includes('rajma')) return '🫘';
  if (lower.includes('mustard')) return '🌱';
  if (lower.includes('ginger')) return '🫚';
  if (lower.includes('turmeric')) return '💛';
  return '🌱';
};

const getTagAndColor = (a) => {
  if (a.severity === 'High') return { tag: 'Disease Alert', color: 'red' };
  if (a.severity === 'Medium') return { tag: 'Pest Control', color: 'amber' };
  return { tag: 'Planning', color: 'green' };
};

const getTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  if (isNaN(diffMs) || diffMs < 0) return 'recently';
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('agrichat_token');
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      setIsLoggedIn(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/advisories/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAdvisories(data);
        }
      } catch (err) {
        console.warn("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute dynamic stats
  const totalQueries = isLoggedIn ? advisories.length : 0;

  const uniqueCrops = isLoggedIn
    ? new Set(advisories.map(a => a.crop.toLowerCase()).filter(Boolean)).size
    : 0;

  const thisWeekQueries = isLoggedIn
    ? advisories.filter(a => {
        const createdDate = new Date(a.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return createdDate >= sevenDaysAgo;
      }).length
    : 0;

  const diseaseAlerts = isLoggedIn
    ? advisories.filter(a => a.severity === 'High').length
    : 0;

  const quickStats = [
    { icon: <MessageSquareText size={20} />, label: 'Total Queries', value: String(totalQueries), color: 'green' },
    { icon: <Leaf              size={20} />, label: 'Crops Covered', value: String(uniqueCrops),  color: 'blue'  },
    { icon: <TrendingUp        size={20} />, label: 'This Week',     value: String(thisWeekQueries),  color: 'purple'},
    { icon: <AlertCircle       size={20} />, label: 'Disease Alerts',value: String(diseaseAlerts),  color: 'amber' },
  ];

  // Map newest 3 queries for layout
  const sortedAdvisories = [...advisories].sort((a, b) => b.id - a.id);
  const displayQueries = sortedAdvisories.slice(0, 3);

  const formattedRecentQueries = displayQueries.map(a => {
    const { tag, color } = getTagAndColor(a);
    const timeAgo = getTimeAgo(a.created_at);
    
    // Derive a clean ChatGPT-like title
    const words = a.query.split(' ');
    const title = words.length > 5 ? words.slice(0, 5).join(' ') + '...' : a.query;

    const treatment = a.advice.split('\n')
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(line => line.length > 0 && !line.startsWith('⚠️'));

    return {
      id: a.id,
      image: getCropEmoji(a.crop),
      tag: tag,
      tagColor: color,
      title: title,
      description: `Asked ${timeAgo} — ${a.crop} query in ${a.region}`,
      actionLabel: 'View details',
      details: {
        symptoms: a.query,
        cause: `Agricultural diagnosis for ${a.crop} in ${a.region} (${a.severity} severity).`,
        treatment: treatment.slice(0, 4),
        safetyWarning: 'Always verify critical decisions with a licensed agricultural extension officer.'
      }
    };
  });

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center justify-center w-full">
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

          {loading ? (
            <div className="flex justify-center py-10 w-full">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !isLoggedIn ? (
            <div className="glass rounded-3xl p-8 border border-green-900/30 text-center w-full max-w-xl mx-auto shadow-xl self-center">
              <p className="text-gray-400 text-sm mb-5">
                You are not logged in. Please sign in or register to store and review your custom advisory dashboard.
              </p>
              <Button variant="primary" onClick={() => navigate('/login')} className="mx-auto">
                Sign In / Register
              </Button>
            </div>
          ) : formattedRecentQueries.length === 0 ? (
            <div className="glass rounded-3xl p-8 border border-green-900/30 text-center w-full max-w-xl mx-auto shadow-xl self-center">
              <p className="text-gray-400 text-sm mb-5">
                No crop queries recorded yet. Start a conversation with AgriChat to consult our expert agricultural AI!
              </p>
              <Button variant="primary" onClick={() => navigate('/chat')} className="mx-auto">
                Start Chatting
              </Button>
            </div>
          ) : (
            /* cards — 1 col → 3 col (centered) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-items-center justify-center w-full">
              {formattedRecentQueries.map((q, i) => (
                <Card 
                  key={i} 
                  {...q} 
                  onClick={() => setSelectedQuery(q)}
                />
              ))}
            </div>
          )}
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
                {selectedQuery.details.treatment.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    {selectedQuery.details.treatment.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">Consult advisor details in the chat feed.</p>
                )}
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
