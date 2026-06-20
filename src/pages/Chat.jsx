import { useState, useRef, useEffect } from 'react';
import { Send, Sprout, RotateCcw, AlertTriangle, Bot, User } from 'lucide-react';

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
    <div className="flex items-end gap-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-600/30 flex items-center justify-center">
        <Bot size={13} className="text-white" />
      </div>
      <div className="chat-bubble-ai px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
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
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!GEMINI_API_KEY) {
        throw new Error('VITE_GEMINI_API_KEY not set. Add it to your .env file.');
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
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I could not generate a response. Please try again.';

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

  const clearChat = () => {
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
    <div className="flex flex-col" style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--color-bg)' }}>
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center glow-green-sm">
              <Sprout size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">AgriChat</h1>
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Agricultural AI — Uttarakhand Expert
              </div>
            </div>
          </div>
          <button
            id="clear-chat-btn"
            onClick={clearChat}
            aria-label="Clear chat"
            title="Clear chat"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/20 border border-green-900/30 text-gray-500 hover:text-green-400 hover:border-green-700/40 text-sm transition-all duration-200"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
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
                className="text-xs px-3 py-2 rounded-full bg-green-900/20 border border-green-800/30 text-green-400 hover:bg-green-800/30 hover:border-green-600/40 transition-all duration-200"
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
          <button
            id="send-message-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white hover:from-green-500 hover:to-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>

        <p className="text-center text-xs text-gray-700 mt-3">
          Press <kbd className="px-1.5 py-0.5 rounded bg-green-900/30 border border-green-800/30 text-green-600 text-xs">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-green-900/30 border border-green-800/30 text-green-600 text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
