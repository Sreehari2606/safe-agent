import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { assistantApi } from '../services/api';

const QUICK_PROMPTS = [
  { label: '🌧️ Rain safety', msg: 'Give me rain safety tips for delivery' },
  { label: '🌙 Night riding', msg: 'Night delivery safety precautions' },
  { label: '🚨 Flood alert', msg: 'What should I do if there is flooding on my route?' },
  { label: '🆘 Emergency', msg: 'What is the emergency protocol?' },
  { label: '⛑️ Helmet tips', msg: 'Tell me about helmet and gear safety' },
  { label: '🌤️ Weather', msg: 'How does weather affect delivery safety?' },
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-swiggy-orange' : 'bg-navy-700 border border-white/10'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-swiggy-orange" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {isUser ? (
          <div className="chat-bubble-user">{msg.content}</div>
        ) : (
          <div className="chat-bubble-bot">
            <div className="whitespace-pre-wrap text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br/>') }}
            />
            {msg.disclaimer && (
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-yellow-400 shrink-0" />
                <p className="text-xs text-yellow-400">{msg.disclaimer}</p>
              </div>
            )}
          </div>
        )}
        <span className="text-xs text-gray-600 px-1">{msg.time}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-8 h-8 rounded-full bg-navy-700 border border-white/10 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-swiggy-orange" />
      </div>
      <div className="chat-bubble-bot">
        <div className="flex gap-1.5 py-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const WELCOME_MSG = {
  id: 0,
  role: 'assistant',
  content: "👋 Hi! I'm the **SafeRoute AI Assistant** (demo mode).\n\nI provide safety guidance for delivery partners. Ask me about:\n- 🌧️ Rain & flood safety\n- 🌙 Night delivery precautions\n- 🚧 Road hazard guidance\n- 🆘 Emergency protocols\n\nType a question or use the quick prompts below!",
  disclaimer: "Demo mode: responses are pre-programmed safety knowledge, not live AI.",
  time: now(),
};

export default function AIAssistant() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: msgText, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await assistantApi.chat(msgText);
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
        disclaimer: data.disclaimer,
        time: now(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "⚠️ Sorry, I couldn't connect to the backend. Please ensure the FastAPI server is running on port 8000.",
        time: now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">

      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-white/5 bg-navy-900/50">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="font-bold text-white">SafeRoute AI Assistant</h1>
            <p className="text-xs text-gray-400">Safety guidance · Demo mode · No API key required</p>
          </div>
          <div className="ml-auto demo-label">DEMO MODE</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map(msg => <Message key={msg.id} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="px-4 lg:px-6 pb-2 max-w-3xl mx-auto w-full">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map(({ label, msg }) => (
            <button
              key={label}
              onClick={() => sendMessage(msg)}
              disabled={loading}
              className="shrink-0 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-white/10 hover:border-swiggy-orange/40 text-xs text-gray-300 hover:text-white rounded-full transition-all duration-200 disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 lg:p-6 pt-2 border-t border-white/5">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about weather safety, road conditions, emergencies..."
            className="input-field flex-1 text-sm"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          <MessageSquare className="w-3 h-3 inline mr-1" />
          Responses are pre-programmed safety knowledge · Not real AI advice
        </p>
      </div>
    </div>
  );
}

