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
      console.error("Battle invocation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#040507] text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Sleek Minimal Header */}
      <header className="h-14 border-b border-zinc-800/80 bg-[#040507]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Arena Engine <span className="text-zinc-600">v1.0</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Alpha</span>
          <span>vs</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Beta</span>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 w-full max-w-6xl mx-auto flex flex-col">
        {messages.length === 0 && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-mono text-zinc-400 mb-4">
              Side-by-side LLM benchmark
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100 mb-2">
              Compare AI Architectures
            </h2>
            <p className="text-zinc-400 text-sm max-w-md">
              Send a code generation, optimization, or logic task to benchmark responses in real time.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-10 w-full animate-in fade-in duration-300">
              <UserMessage message={msg.problem} />
              <ArenaResponse
                solution1={msg.solution_1}
                solution2={msg.solution_2}
                judge={msg.judge}
              />
            </div>
          ))
        )}

        {/* Dynamic Loading State */}
        {loading && (
          <div className="my-6 p-6 rounded-2xl border border-zinc-800/80 bg-[#090b10]/60 flex items-center justify-center gap-3">
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-zinc-400 tracking-wider uppercase">
              Generating parallel solutions & scoring verdict...
            </span>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </main>

      {/* Bottom Floating Console Input */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-[#040507] via-[#040507]/90 to-transparent sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSend}
            className="relative flex items-center rounded-2xl bg-[#0b0e14] border border-zinc-800 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/40 transition-all p-1.5 shadow-2xl"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              placeholder="Enter benchmark prompt (e.g. Write LRU Cache with O(1) ops)..."
              className="w-full bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <span>Execute</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925H9a.75.75 0 010 1.5H3.693l-1.414 4.924a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}