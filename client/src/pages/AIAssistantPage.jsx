import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, ShieldCheck, RefreshCw, Leaf, HelpCircle, MessageSquare } from 'lucide-react';
import api from '../services/api';

const QUICK_QUESTIONS = [
  "టమాటా పంటకు ఏ ఎరువు వాడాలి?",
  "గుంటూరు మిరపకాయల తెగుళ్ల నివారణ ఎలా?",
  "How to get organic certification for my farm?",
  "మంచి నాణ్యమైన విత్తనాలు ఎక్కడ లభిస్తాయి?",
  "What is the best harvesting time for mangoes?"
];

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `నమస్కారం! నేను ఆర్గో ఏఐ (ArgoAI) - మీ డిజిటల్ వ్యవసాయ సహాయకుడిని.\n\nమీరు మీ పంటల సంరక్షణ, ఎరువుల వినియోగం, పురుగుల నివారణ, మరియు ఆర్గోకనెక్ట్ మార్కెట్ సేవలకు సంబంధించి తెలుగు లేదా ఇంగ్లీష్ లో ప్రశ్నలు అడగవచ్చు.\n\nHello! Ask any question about crop health, fertilizers, organic farming, or Argoconnect produce listings.`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText) => {
    const text = queryText || inputPrompt;
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { prompt: text });
      if (res.data && res.data.response) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'assistant', text: res.data.response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'assistant', text: 'సర్వర్ నుండి సమాధానం రావడం లేదు. దయచేసి క్షణాల్లో మళ్ళీ ప్రయత్నించండి.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-200">
            <Bot className="w-4 h-4 text-emerald-300" /> Dedicated Telugu & English Farming AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">ఆర్గో ఏఐ (ArgoAI Smart Assistant)</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Get instant crop care advice, pest management tips, organic farming techniques, and marketplace guidance in your language.
          </p>
        </div>

        <button
          onClick={() => setMessages([{ id: 1, sender: 'assistant', text: 'సంభాషణ రీసెట్ చేయబడింది. కొత్త ప్రశ్న అడగండి!' }])}
          className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">వ్యవసాయ భద్రత మార్గదర్శకాలు (Safeguard Notice):</span>
          <p className="mt-0.5 text-[11px] text-amber-800 leading-relaxed">
            AI సహాయకుడు అందించే సమాచారం సాధారణ అవగాహన కోసం మాత్రమే. రసాయన క్రిమిసంహారకాలు వాడే సమయంలో స్థానిక వ్యవసాయ అధికారుల లేదా కృషి విజ్ఞాన కేంద్రం (KVK) సూచనలను ఖచ్చితంగా పాటించండి.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Suggested Quick Questions Sidebar */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-green-600" /> Popular Crop Queries
          </h3>
          <div className="space-y-2">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="w-full text-left text-xs bg-green-50/60 hover:bg-green-100 text-green-900 p-3 rounded-xl border border-green-200 transition line-clamp-2"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col h-[580px] overflow-hidden">
          
          {/* Message Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none font-sans'
                }`}>
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-2 shadow-sm">
                  <Bot className="w-4 h-4 text-green-600 animate-spin" />
                  <span>ఆర్గో ఏఐ సమాధానం రూపొందిస్తోంది... (Generating AI response)</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-white border-t border-gray-200 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="మీ పంట లేదా మార్కెట్ ప్రశ్నను ఇక్కడ టైప్ చేయండి (Ask in Telugu or English)..."
              className="flex-1 text-xs sm:text-sm p-3.5 bg-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-6 py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default AIAssistantPage;
