import { useState, useRef, useEffect } from 'react';
import { Send, Sprout, RotateCcw, AlertTriangle, Bot, User } from 'lucide-react';
import { Button, Modal, Toast, Loader } from '../components/ui';
import { API_BASE_URL } from '../config';

const SYSTEM_PROMPT = `You are AgriChat, an expert agricultural advisor specializing in Uttarakhand's mountain crops and farming practices. 
You ONLY answer questions related to:
- Crop diseases and pest management (rajma, wheat, potato, millet, mustard, ginger, turmeric, etc.)
- Soil health, fertilization, and organic farming practices
- Seasonal planting calendars specific to Uttarakhand
- Irrigation, water management in hilly terrain
- Government schemes for Uttarakhand farmers
- Post-harvest handling and storage

For ANY question outside agriculture (politics, entertainment, general knowledge, coding, etc.), politely decline and redirect.
Always end responses with: "⚠️ Please verify this advice with a licensed agricultural extension officer before acting on it."
Keep responses practical, concise, and easy for a non-expert supervisor to understand.
Use bullet points when listing multiple steps or options.`;

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Namaste! 🌿 I'm AgriChat — your AI farming advisor for Uttarakhand. Ask me anything about your crops, diseases, pests, or seasonal planning. I'm here to help!\n\n*Example: \"My potato leaves have brown spots. What should I do?\"*",
  timestamp: new Date(),
};

function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-green-500 to-green-700'
            : 'bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-600/30'
        }`}
      >
        {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
      </div>

      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-gray-200'
        }`}>
          {message.content}
        </div>
        <span className="text-xs text-gray-600 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fadeInUp">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-600/30 flex items-center justify-center shrink-0">
        <Bot size={13} className="text-white" />
      </div>
      <div className="chat-bubble-ai px-4 py-3 flex items-center gap-2">
        <Loader size="sm" color="green" />
        <span className="text-xs text-green-400 font-semibold tracking-wider uppercase animate-pulse">Consulting Gemini...</span>
      </div>
    </div>
  );
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function Chat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('agrichat_token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/advisories/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const historyMessages = [];
          data.forEach(advisory => {
            historyMessages.push({
              role: 'user',
              content: advisory.query,
              timestamp: new Date(advisory.created_at)
            });
            historyMessages.push({
              role: 'assistant',
              content: advisory.advice,
              timestamp: new Date(advisory.created_at)
            });
          });
          if (historyMessages.length > 0) {
            setMessages([INITIAL_MESSAGE, ...historyMessages]);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch chat history from database:", err);
      }
    };

    fetchHistory();
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let aiText = '';
      let backendSuccess = false;

      // Attempt to query the local FastAPI backend
      try {
        let crop = "General";
        const queryLower = trimmed.toLowerCase();
        const crops = ["potato", "wheat", "rajma", "beans", "millet", "mustard", "ginger", "turmeric", "onion", "garlic", "rice", "apple"];
        for (const c of crops) {
          if (queryLower.includes(c)) {
            crop = c.charAt(0).toUpperCase() + c.slice(1);
            break;
          }
        }

        let region = "Uttarakhand";
        const regions = ["kumaon", "garhwal", "almora", "nainital", "dehradun", "haridwar", "chamoli", "pithoragarh"];
        for (const r of regions) {
          if (queryLower.includes(r)) {
            region = r.charAt(0).toUpperCase() + r.slice(1);
            break;
          }
        }

        let severity = "Medium";
        if (queryLower.includes("severe") || queryLower.includes("urgent") || queryLower.includes("critical") || queryLower.includes("dying") || queryLower.includes("rust") || queryLower.includes("rot")) {
          severity = "High";
        } else if (queryLower.includes("mild") || queryLower.includes("small") || queryLower.includes("low")) {
          severity = "Low";
        }

        const token = localStorage.getItem('agrichat_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const backendResponse = await fetch(`${API_BASE_URL}/api/advisories/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            crop,
            query: trimmed,
            region,
            severity,
            status: "Draft"
          })
        });

        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          aiText = backendData.advice;
          backendSuccess = true;
          console.log("Advice generated successfully from local FastAPI backend.");
        } else {
          console.warn(`FastAPI backend returned status ${backendResponse.status}, falling back to direct Gemini API.`);
        }
      } catch (backendErr) {
        console.warn("FastAPI backend is offline, falling back to direct Gemini API:", backendErr);
      }

      // Fallback: Direct Gemini API query from client-side if backend fails or is down
      if (!backendSuccess) {
        if (!GEMINI_API_KEY) {
          throw new Error('VITE_GEMINI_API_KEY not set and local backend is offline. Please configure your key or start the backend.');
        }

        const history = messages
          .filter((m) => m.role !== 'assistant' || messages.indexOf(m) !== 0)
          .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

        history.push({ role: 'user', parts: [{ text: trimmed }] });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: history,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        aiText =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Sorry, I could not generate a response. Please try again.';
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiText, timestamp: new Date() },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Error: ${err.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    const token = localStorage.getItem('agrichat_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      await fetch(`${API_BASE_URL}/api/advisories/`, {
        method: 'DELETE',
        headers
      });
    } catch (err) {
      console.warn("Failed to delete chat history on backend:", err);
    }

    setMessages([INITIAL_MESSAGE]);
    setError(null);
  };

  const suggestedQueries = [
    'My beans have yellow spots 🫘',
    'Best time to plant potato in Kumaon?',
    'Organic treatment for aphids',
    'Wheat rust prevention tips',
  ];

  return (
    <div className="flex flex-col w-full items-center" style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--color-bg)' }}>
      <div className="flex-1 flex flex-col max-w-4xl w-full px-6 sm:px-10 py-6">
        {/* Header */}
        <div className="relative flex flex-col items-center justify-center text-center mb-6 w-full gap-2">
          {/* Clear button (top right absolute) */}
          <Button
            id="clear-chat-btn"
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirmOpen(true)}
            aria-label="Clear chat"
            title="Clear chat"
            className="absolute right-0 top-1/2 -translate-y-1/2 border border-green-900/30"
          >
            <RotateCcw size={13} className="mr-1.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center glow-green-sm mb-1 shrink-0">
            <Sprout size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] leading-tight">AgriChat</h1>
            <div className="flex items-center justify-center gap-1.5 text-xs text-green-400 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Agricultural AI — Uttarakhand Expert
            </div>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-amber-900/10 border border-amber-800/20">
          <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-500/80 leading-relaxed">
            AI responses are for informational purposes only. Always consult a licensed agricultural extension officer before making critical farming decisions.
          </p>
        </div>

        {/* Messages area */}
        <div className="flex-1 glass rounded-2xl p-5 mb-4 overflow-y-auto space-y-5 min-h-[400px] max-h-[520px]">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested queries (only when chat is fresh) */}
        {messages.length <= 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedQueries.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                  textareaRef.current?.focus();
                }}
                className="text-xs px-3 py-2 rounded-full bg-green-900/20 border border-green-800/30 text-green-400 hover:bg-green-800/30 hover:border-green-600/40 transition-all duration-200 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-red-900/20 border border-red-800/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Input area */}
        <div className="glass rounded-2xl p-3 flex items-end gap-3">
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your crops, diseases, pests… (Enter to send)"
            rows={2}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 resize-none outline-none leading-relaxed"
            disabled={isLoading}
          />
          <Button
            id="send-message-btn"
            size="icon"
            disabled={!input.trim()}
            isLoading={isLoading}
            onClick={sendMessage}
            aria-label="Send message"
            className="rounded-xl"
          >
            <Send size={16} />
          </Button>
        </div>

        <p className="text-center text-xs text-gray-700 mt-3">
          Press <kbd className="px-1.5 py-0.5 rounded bg-green-900/30 border border-green-800/30 text-green-600 text-xs">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-green-900/30 border border-green-800/30 text-green-600 text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>

      {/* Confirmation Modal for Clearing Chat History */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Clear Chat History"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              clearChat();
              setIsConfirmOpen(false);
              setToast({ message: 'Chat history cleared successfully', type: 'success' });
            }}>Clear History</Button>
          </>
        }
      >
        <div className="text-gray-300">
          Are you sure you want to clear your chat history? This action cannot be undone and all current messages will be lost.
        </div>
      </Modal>

      {/* Toast message if present */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
