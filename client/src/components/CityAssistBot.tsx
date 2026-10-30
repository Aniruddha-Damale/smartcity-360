import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Sparkles, HelpCircle, 
  ChevronRight, MapPin, Search, RefreshCw, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCityData } from '../context/CityDataContext';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isDemo?: boolean;
}

export const CityAssistBot: React.FC = () => {
  const { user } = useAuth();
  const { complaints } = useCityData();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      text: `Hello ${user?.full_name ? user.full_name.split(' ')[0] : 'Citizen'}! I am **CityAssist AI**, your 24/7 smart civic guide. How can I assist you with municipal services, reporting an issue, or tracking your grievance?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Check if user is asking about a complaint reference number
      const refMatch = query.match(/SC360-\d{4}-\d{5}/i);
      let replyText = '';

      if (refMatch) {
        const found = complaints.find(c => c.reference_number.toUpperCase() === refMatch[0].toUpperCase());
        if (found) {
          replyText = `Found grievance **#${found.reference_number}**:\n\n• **Title**: ${found.title}\n• **Status**: ${found.status.replace('_', ' ').toUpperCase()}\n• **Assigned Dept**: ${found.assigned_department_name}\n• **Ward**: ${found.ward}\n• **Last Updated**: ${new Date(found.updated_at).toLocaleDateString()}\n\nOur team is adhering to the 36-hour resolution SLA.`;
        } else {
          replyText = `I checked the municipal registry for **#${refMatch[0].toUpperCase()}**, but could not locate that reference number. Please verify your reference format (e.g. SC360-2026-00101).`;
        }
      } else {
        // Call AI backend / resilient fallback
        replyText = await api.chatWithAI(query, {
          name: user?.full_name,
          role: user?.role
        });
      }

      setMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemo: true,
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'I am momentarily having trouble reaching the municipal AI servers. Please check your network or try again in a few moments.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How do I report a pothole?',
    'Track complaint #SC360-2026-00101',
    'Water supply shortage helpline',
    'Which department fixes streetlights?',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-navy-900 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-brand-500/25 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Open CityAssist AI"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-brand-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-brand-700 animate-pulse" />
          </div>
          <span className="text-sm font-bold tracking-tight">CityAssist AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-brand-200 shadow-inner">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">CityAssist AI</h3>
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">24/7 Civic Redressal Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Banner */}
          <div className="bg-brand-50/70 border-b border-brand-100 px-3.5 py-1.5 text-[11px] text-brand-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Smart City Metropolitan Intelligence
            </span>
            <span className="text-[10px] text-brand-600 font-mono">Demo Mode Active</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2 py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                <span>CityAssist is analyzing municipal database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="shrink-0 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 text-[11px] px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about potholes, tracking #, water..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
