import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from 'axios';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  // Exact Miracle Halftone Matrix Canvas Shader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const spacing = 11; // Dot density
    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;

          // Diagonal light wave equation matching image
          const diag1 = Math.sin(x * 0.004 + y * 0.005 + time) * 0.5;
          const diag2 = Math.cos(x * 0.006 - y * 0.003 + time * 1.3) * 0.5;
          const wave = (diag1 + diag2 + 1) / 2;

          // Dot size and brightness mapped to halftone threshold
          const radius = Math.max(0.6, wave * 2.8);
          const alpha = Math.pow(wave, 2.2) * 0.95;

          if (alpha > 0.04) {
            ctx.fillStyle = `rgba(240, 243, 250, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
        judge: resultData.judge,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Invocation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020408] text-white flex flex-col selection:bg-white/20 selection:text-white overflow-x-hidden">
      
      {/* Halftone Canvas & Ambient Vignette */}
      <canvas ref={canvasRef} className="miracle-canvas" />
      <div className="matrix-vignette" />

      {/* Luxury Minimal Header */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-white font-sans lowercase">miracle</span>
            <span className="text-white text-base">✦</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            <span>Dual Agent Arena</span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full transition-all cursor-pointer backdrop-blur-md"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-20 flex-1 flex flex-col items-center w-full max-w-4xl mx-auto px-4 pb-36">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-14 md:mt-24 mb-10 w-full">
            
            {/* Center Brand Title */}
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <h1 className="text-6xl sm:text-8xl font-bold tracking-tight text-white lowercase">
                miracle
              </h1>
              <span className="text-3xl sm:text-5xl text-white -mt-6 sm:-mt-8 animate-pulse">✦</span>
            </div>

            <p className="text-slate-400 text-sm sm:text-base max-w-md mb-10 leading-relaxed font-normal">
              Autonomous dual-LLM code benchmark powered by LangGraph parallel engine.
            </p>

            {/* Central Capsule Search Console */}
            <div className="w-full max-w-2xl mb-12">
              <form onSubmit={handleSend} className="miracle-pill-bar p-2 flex items-center gap-2">
                <div className="pl-4 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={loading}
                  placeholder="Enter a prompt to run side-by-side battle..."
                  className="flex-1 bg-transparent px-2 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-sans"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  className="miracle-btn disabled:opacity-30 disabled:pointer-events-none text-xs px-6 py-2.5 flex items-center gap-1.5 cursor-pointer font-bold tracking-wide"
                >
                  <span>Execute</span>
                  <span className="text-xs">✦</span>
                </button>
              </form>
            </div>

            {/* Matrix Dock Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              <div className="miracle-card p-3.5 rounded-2xl flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-white">Mistral Node</p>
                  <p className="text-[11px] text-slate-400">Engine Stream A</p>
                </div>
                <span className="text-[11px] font-mono text-white">✦ Ready</span>
              </div>

              <div className="miracle-card p-3.5 rounded-2xl flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-white">Gemini Pro</p>
                  <p className="text-[11px] text-slate-400">Engine Stream B</p>
                </div>
                <span className="text-[11px] font-mono text-white">✦ Ready</span>
              </div>

              <div className="miracle-card p-3.5 rounded-2xl flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-white">Autonomous Judge</p>
                  <p className="text-[11px] text-slate-400">Scored Arbitration</p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Active</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full mt-4 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className="w-full space-y-4">
                <UserMessage message={msg.problem} timestamp={msg.timestamp} />
                <ArenaResponse
                  solution1={msg.solution_1}
                  solution2={msg.solution_2}
                  judge={msg.judge}
                />
              </div>
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="my-8 miracle-pill-bar px-6 py-3.5 flex items-center gap-3">
            <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-slate-300">
              Generating parallel models and awaiting judge scoring...
            </span>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </main>

      {/* Floating Bottom Console */}
      {messages.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-40 px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSend} className="miracle-pill-bar p-2 flex items-center gap-2 shadow-2xl">
              <div className="pl-4 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                placeholder="Ask another question..."
                className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-slate-400 outline-none font-sans"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="miracle-btn disabled:opacity-30 disabled:pointer-events-none text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <span>Execute</span>
                <span className="text-xs">✦</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}