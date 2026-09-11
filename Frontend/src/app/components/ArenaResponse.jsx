import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

function CodeBlock({ className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const textToCopy = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl border border-zinc-800 bg-[#090b10] overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900/60 border-b border-zinc-800/80 text-xs text-zinc-400">
        <span className="font-mono">{className?.replace('language-', '') || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-zinc-200 leading-relaxed font-mono">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function ArenaResponse({ solution1, solution2, judge }) {
  const [copiedSol, setCopiedSol] = useState(null);

  useEffect(() => {
    hljs.highlightAll();
  }, [solution1, solution2]);

  const copySolution = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedSol(id);
    setTimeout(() => setCopiedSol(null), 2000);
  };

  const isSol1Winner = judge && judge.solution_1_score > judge.solution_2_score;
  const isSol2Winner = judge && judge.solution_2_score > judge.solution_1_score;

  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-5 mb-3 text-zinc-100" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2 text-zinc-100" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-3 mb-2 text-zinc-200" {...props} />,
    p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-zinc-300 text-[15px]" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 text-zinc-300 space-y-1 text-sm" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 text-zinc-300 space-y-1 text-sm" {...props} />,
    code: ({ node, inline, className, children, ...props }) => {
      return !inline ? (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      ) : (
        <code className="bg-zinc-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono border border-zinc-700/50" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 my-6 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Solution 1 - Cyan Rim */}
        <div className={`relative flex flex-col rounded-2xl bg-[#090b10]/95 backdrop-blur-xl border transition-all duration-300 p-6 ${
          isSol1Winner 
            ? 'border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.15)]' 
            : 'border-zinc-800 hover:border-cyan-500/30'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              <h3 className="text-xs font-bold tracking-wider uppercase text-cyan-400 font-mono">Model Alpha</h3>
              {isSol1Winner && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full tracking-wide">
                  WINNER
                </span>
              )}
            </div>
            <button
              onClick={() => copySolution(solution1, 'sol1')}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {copiedSol === 'sol1' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 text-zinc-300 text-sm overflow-x-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {solution1}
            </ReactMarkdown>
          </div>
        </div>

        {/* Solution 2 - Amber Rim */}
        <div className={`relative flex flex-col rounded-2xl bg-[#090b10]/95 backdrop-blur-xl border transition-all duration-300 p-6 ${
          isSol2Winner 
            ? 'border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]' 
            : 'border-zinc-800 hover:border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
              <h3 className="text-xs font-bold tracking-wider uppercase text-amber-400 font-mono">Model Beta</h3>
              {isSol2Winner && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full tracking-wide">
                  WINNER
                </span>
              )}
            </div>
            <button
              onClick={() => copySolution(solution2, 'sol2')}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {copiedSol === 'sol2' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 text-zinc-300 text-sm overflow-x-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {solution2}
            </ReactMarkdown>
          </div>
        </div>

      </div>

      {/* Judge Recommendation Matrix */}
      {judge && (
        <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800/90 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-base">⚖️</span>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-400">
              Battle Evaluation & Scoring
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alpha Evaluation */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-medium text-cyan-400">Model Alpha</span>
                <span className="text-lg font-bold font-mono text-cyan-300">{judge.solution_1_score}<span className="text-xs text-zinc-500">/10</span></span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {judge.solution_1_reasoning}
              </p>
            </div>

            {/* Beta Evaluation */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-medium text-amber-400">Model Beta</span>
                <span className="text-lg font-bold font-mono text-amber-300">{judge.solution_2_score}<span className="text-xs text-zinc-500">/10</span></span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {judge.solution_2_reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}