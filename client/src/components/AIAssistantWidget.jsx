import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Volume2, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../services/api';

const SAMPLE_PROMPTS = [
  "టమాటా పంటకు ఏ ఎరువు మంచిది?",
  "How can I improve my crop yield?",
  "మంచి ఆవు నెయ్యి ఎక్కడ దొరుకుతుంది?",
  "Pest management tips for chili crop"
];

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'నమస్కారం! నేను ఆర్గో ఏఐ (ArgoAI) - మీ తెలుగు డిజిటల్ రైతు సహాయకుడిని. పంటల సంరక్షణ, ఎరువులు, ఆలేదా మార్కెట్‌ప్లేస్ సేవలకు నన్ను అడగండి!\n\nHello! How can I assist your farm today?'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { prompt: query });
      if (res.data && res.data.response) {
        const assistantMessage = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: res.data.response
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: 'క్షమించండి! సర్వర్ సంబంధిత సమస్య వల్ల సమాధానం పొందడంలో ఆలస్యమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Closed State Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-800 hover:to-green-700 text-white px-5 py-3.5 rounded-full shadow-2xl transition transform hover:scale-105 group border-2 border-emerald-300/40"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight">ఆర్గో ఏఐ (AI Assistant)</p>
            <p className="text-[10px] text-emerald-100">Ask Agriculture Questions</p>
          </div>
        </button>
      )}

      {/* Open State Chat Pop-up Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[540px] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  ArgoAI (ఆర్గో ఏఐ)
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                </h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online • Telugu & English Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([{ id: 1, sender: 'assistant', text: 'సంభాషణ రీసెట్ చేయబడింది. మళ్ళీ ప్రశ్నలు అడగవచ్చు!' }])}
                title="Reset Chat"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Safety Safeguard Banner */}
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center gap-1.5 text-[10px] text-amber-800">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>కృషి విజ్ఞాన కేంద్రం (KVK) రక్షణ సూచన: రసాయన ఎరువుల ఖచ్చిత పరిమాణం కోసం అధికారులను సంప్రదించండి.</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs flex items-center gap-2 shadow-sm">
                  <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>సమాధానం తయారవుతోంది...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Pills */}
          <div className="p-2 bg-white border-t border-gray-100 overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="తెలుగు లేదా ఇంగ్లీష్ లో అడగండి..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-md transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AIAssistantWidget;
