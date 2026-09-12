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
      // LangGraph Backend invocation
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
    <div className="relative min-h-screen bg-[#0d0d11] text-zinc-100 font-sans selection:bg-orange-500/20 selection:text-orange-300 flex flex-col overflow-x-hidden">

      {/* Background Layers */}
      <div className="fixed inset-0 arena-grid-bg pointer-events-none opacity-40 z-0"></div>
      <div className="fixed inset-0 arena-hero-glow pointer-events-none z-0"></div>

      {/* Arena Navigation Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_#ff8543] animate-pulse"></div>
          <span className="text-base font-semibold tracking-wide text-white">LangGraph Battle Arena</span>
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/25">
            Graph Active
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-xl backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Parallel Nodes</span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all cursor-pointer backdrop-blur-sm"
            >
              Reset Arena
            </button>
          )}
        </div>
      </header>

      {/* Main Execution Arena Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 pb-32">

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 md:mt-16 mb-12">

            {/* Exact Figma Inspired Hero Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white max-w-3xl leading-[1.12]">
              Battle <span className="serif-accent">AI models</span><br />
              Head-to-Head.<br />
              Judged by AI
            </h1>

            <p className="mt-6 text-zinc-400 text-sm sm:text-base max-w-lg font-light leading-relaxed">
              Parallel execution over LangGraph workflow with autonomous LLM evaluation.
            </p>

            {/* Model Benchmark Pillars */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl border-t border-zinc-800/60 pt-8">
              <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm text-center">
                <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Node Alpha</p>
                <h4 className="text-sm font-semibold text-zinc-200 mt-1">Mistral AI</h4>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm text-center">
                <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Node Beta</p>
                <h4 className="text-sm font-semibold text-zinc-200 mt-1">Gemini 1.5 Pro</h4>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm text-center">
                <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Judge Node</p>
                <h4 className="text-sm font-semibold text-zinc-200 mt-1">Evaluator LLM</h4>
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

        {/* Loading Indicator */}
        {loading && (
          <div className="my-8 p-5 rounded-2xl border border-orange-500/30 bg-zinc-950/80 backdrop-blur-md flex items-center gap-3 shadow-xl">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-orange-200 tracking-wider">
              Executing LangGraph nodes & awaiting Judge decision...
            </span>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </main>

      {/* Floating Bottom Console */}
      <div className="fixed bottom-6 inset-x-0 z-30 px-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl p-2.5 focus-within:border-orange-500/60 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              placeholder="Ask a coding problem (e.g., Write an LRU Cache in TypeScript)..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-950 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer font-mono uppercase tracking-wider"
            >
              <span>Invoke</span>
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