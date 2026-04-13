'use client';
import { useState, useEffect, useRef } from "react";
import { Bot, Send, Loader2 } from "lucide-react";

export const AIChatCard = ({ dataKonteks }: { dataKonteks: any }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, contextData: dataKonteks }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(99, 102, 241, 0.3); 
          border-radius: 10px; 
        }
      `}</style>

      {/* Tinggi dikurangi menjadi h-[320px] */}
      <div className="bg-[#1e1b4b] rounded-2xl p-5 shadow-xl text-white flex flex-col h-[382px] w-full border border-white/5">
        
        {/* Header - Lebih compact */}
        <div className="flex items-center gap-3 mb-3 shrink-0">
          <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-300">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none mb-1">Intelligence</p>
            <h2 className="text-md font-bold leading-none">DahaGoe AI</h2>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 custom-scrollbar"
        >
          {messages.length === 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 relative mt-2">
              <p className="text-[11px] text-indigo-100 italic leading-relaxed opacity-70">
                Sistem aktif. Ada yang ingin Anda tanyakan terkait kondisi laut?
              </p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-2.5 rounded-xl text-[11px] leading-snug ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 rounded-tl-none text-indigo-50'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                <Loader2 size={12} className="animate-spin text-indigo-400" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="relative shrink-0 pt-2 border-t border-white/5">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tanya AI..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-[11px] focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="absolute right-1.5 top-[13px] p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </>
  );
};