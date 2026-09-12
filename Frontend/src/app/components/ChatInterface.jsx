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
      const resultData = data.result || data;

      const newMessage = {
        id: Date.now(),
        problem: currentPrompt,
        solution_1: resultData.solution_1 || resultData.solution1,
        solution_2: resultData.solution_2 || resultData.solution2,
        judge: resultData.judge
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("LangGraph invocation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050910] text-zinc-100 font-sans selection:bg-[#00f5d4]/20 selection:text-[#00f5d4] flex flex-col overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 dink-grid pointer-events-none opacity-60 z-0"></div>
      <div className="fixed inset-0 dink-aura pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0fe3b8] to-[#00b4d8] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.4)]">
            <span className="text-[#050910] font-black text-sm">✦</span>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              LangGraph Arena <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30">v1.0</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-[#08121f]/80 border border-zinc-800/90 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse"></span>
            <span>Graph Nodes Ready</span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-4 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-[#0a1424] hover:bg-[#0f1d33] border border-zinc-800 rounded-full transition-all cursor-pointer backdrop-blur-md"
            >
              Clear Feed
            </button>
          )}
        </div>
      </header>

      {/* Hero & Content Arena */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 pb-36">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-14 md:mt-20 mb-12">
            
            {/* Top Glowing Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/25 text-[#00f5d4] text-xs font-mono mb-6 backdrop-blur-md">
              <span>✦</span> Dual Intelligence Comparison
            </div>

            {/* Video-Style Hero Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-3xl leading-[1.12]">
              Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] to-[#38bdf8]">AI Chatbot</span><br />
              Battle Arena
            </h1>

            <p className="mt-6 text-zinc-400 text-sm sm:text-base max-w-lg font-normal leading-relaxed">
              Synthesizing and benchmarking multi-model reasoning directly through LangGraph orchestration.
            </p>

            {/* Floating Model Stacked Badges */}
            <div className="flex items-center justify-center gap-3.5 mt-14 flex-wrap max-w-2xl">
              <div className="px-5 py-2.5 rounded-2xl border border-[#00f5d4]/25 bg-[#0a1424]/70 backdrop-blur-md text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]"></span>
                Mistral Large
              </div>
              <div className="px-5 py-2.5 rounded-2xl border border-sky-500/25 bg-[#0a1424]/70 backdrop-blur-md text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                Gemini 1.5 Pro
              </div>
              <div className="px-5 py-2.5 rounded-2xl border border-purple-500/25 bg-[#0a1424]/70 backdrop-blur-md text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Automated Judge
              </div>
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

        {/* Loading Glow Box */}
        {loading && (
          <div className="my-8 px-6 py-4 rounded-2xl border border-[#00f5d4]/40 bg-[#071322]/80 backdrop-blur-md flex items-center gap-3 shadow-[0_0_25px_rgba(0,245,212,0.15)]">
            <div className="w-4 h-4 border-2 border-[#00f5d4] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-[#00f5d4] tracking-wider">
              Querying LangGraph parallel nodes...
            </span>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </main>

      {/* Video-Style Pill Capsule Floating Bar */}
      <div className="fixed bottom-7 inset-x-0 z-30 px-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSend}
            className="flex items-center rounded-full bg-[#08121f]/90 neon-border-cyan backdrop-blur-xl p-2 transition-all shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
          >
            {/* Search Icon */}
            <div className="pl-4 pr-2 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              placeholder="Search docs or ask a coding problem..."
              className="flex-1 bg-transparent px-2 py-3 text-sm text-white placeholder-zinc-500 outline-none font-sans"
            />

            {/* Video-Style "Ask AI" Pill Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="neon-btn-glow hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-[#050910] font-bold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-sans tracking-wide"
            >
              <span>✦</span>
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}