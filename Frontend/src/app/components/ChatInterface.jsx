import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from 'axios';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const currentPrompt = inputValue.trim();
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: currentPrompt
      });

      const data = response.data;
      const newMessage = {
        id: Date.now(),
        problem: currentPrompt,
        ...(data.result || data)
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Invocation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0d0f] text-zinc-100 font-sans selection:bg-orange-500/20 selection:text-orange-300 flex flex-col overflow-x-hidden">
      
      {/* Background Grid Pattern & Ambient Glow */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0"></div>
      <div className="fixed inset-0 hero-glow pointer-events-none z-0"></div>

      {/* AI Battle Arena Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight text-white">AI Battle Arena</span>
          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Live Benchmark
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-xl backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Parallel Reasoning</span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all cursor-pointer backdrop-blur-sm"
            >
              Clear Feed
            </button>
          )}
        </div>
      </header>

      {/* Hero Section & Conversation Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 pb-28">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-14 md:mt-18 mb-12">
            
            {/* Main Hero Header */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white max-w-3xl leading-[1.12]">
              Power <span className="font-serif-glow">AI apps</span><br />
              with Clean Data.<br />
              It’s Open Source
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-zinc-400 text-sm sm:text-base max-w-lg font-light leading-relaxed">
              Side-by-side multi-model reasoning and automated execution benchmark.
            </p>

            {/* Supported Models Badges */}
            <div className="flex items-center justify-center gap-3 mt-16 max-w-xl flex-wrap">
              <span className="px-4 py-2 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm text-xs font-mono tracking-wider text-zinc-400">
                MISTRAL LARGE
              </span>
              <span className="px-4 py-2 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm text-xs font-mono tracking-wider text-zinc-400">
                GEMINI PRO
              </span>
              <span className="px-4 py-2 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm text-xs font-mono tracking-wider text-zinc-400">
                COHERE COMMAND
              </span>
            </div>

          </div>
        ) : (
          /* Response Stream */
          <div className="w-full mt-6 space-y-10">
            {messages.map((msg) => (
              <div key={msg.id} className="w-full">
                <UserMessage message={msg.problem} />
                <ArenaResponse
                  solution1={msg.solution_1}
                  solution2={msg.solution_2}
                  judge={msg.judge}
                />
              </div>
            ))}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="my-6 p-4 rounded-xl border border-orange-500/30 bg-zinc-950/60 backdrop-blur-md flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-orange-200 tracking-wider">
              Evaluating models and streaming response...
            </span>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </main>

      {/* Floating Center Input Console */}
      <div className="fixed bottom-6 inset-x-0 z-30 px-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl p-2 focus-within:border-orange-500/50 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              placeholder="Ask a coding question or enter problem..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-950 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Run</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}