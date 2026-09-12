import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

function CodeSnippet({ className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const text = String(children).replace(/\n$/, '');

  const copyCode = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl border border-[#00f5d4]/20 bg-[#040810] overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a1322] border-b border-zinc-800/80 text-xs text-zinc-400 font-mono">
        <span className="text-[#00f5d4]">{className?.replace('language-', '') || 'code'}</span>
        <button
          type="button"
          onClick={copyCode}
          className="hover:text-white transition-colors cursor-pointer"
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
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    hljs.highlightAll();
  }, [solution1, solution2]);

  const copyText = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isSol1Winner = judge && judge.solution_1_score > judge.solution_2_score;
  const isSol2Winner = judge && judge.solution_2_score > judge.solution_1_score;

  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 text-white" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2 text-white" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-2 mb-1 text-zinc-200" {...props} />,
    p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-zinc-300 text-sm" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 text-zinc-300 space-y-1 text-sm" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 text-zinc-300 space-y-1 text-sm" {...props} />,
    code: ({ node, inline, className, children, ...props }) => {
      return !inline ? (
        <CodeSnippet className={className} {...props}>
          {children}
        </CodeSnippet>
      ) : (
        <code className="bg-[#0b1b2d] text-[#00f5d4] px-1.5 py-0.5 rounded text-xs font-mono border border-[#00f5d4]/30" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 my-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Solution 1 Card */}
        <div className={`relative flex flex-col rounded-2xl bg-[#08121f]/85 backdrop-blur-xl border transition-all duration-300 p-6 ${
          isSol1Winner 
            ? 'neon-border-cyan' 
            : 'border-zinc-800/90 hover:border-[#00f5d4]/40'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]"></span>
              <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-200 font-mono">Dink Bot A</h3>
              {isSol1Winner && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30 rounded-full font-mono">
                  WINNER
                </span>
              )}
            </div>
            <button
              onClick={() => copyText(solution1, 'sol1')}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedId === 'sol1' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 text-zinc-300 text-sm overflow-x-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {solution1}
            </ReactMarkdown>
          </div>
        </div>

        {/* Solution 2 Card */}
        <div className={`relative flex flex-col rounded-2xl bg-[#08121f]/85 backdrop-blur-xl border transition-all duration-300 p-6 ${
          isSol2Winner 
            ? 'neon-border-cyan' 
            : 'border-zinc-800/90 hover:border-sky-500/40'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
              <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-200 font-mono">Dink Bot B</h3>
              {isSol2Winner && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-full font-mono">
                  WINNER
                </span>
              )}
            </div>
            <button
              onClick={() => copyText(solution2, 'sol2')}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedId === 'sol2' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 text-zinc-300 text-sm overflow-x-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {solution2}
            </ReactMarkdown>
          </div>
        </div>

      </div>

      {/* Judge Verdict Panel */}
      {judge && (
        <div className="rounded-2xl bg-[#060e19] border border-[#00f5d4]/20 p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[#00f5d4]">⚖️</span>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f5d4]">
              Judge Evaluation
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#091524] border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-medium text-[#00f5d4]">Bot A Score</span>
                <span className="text-lg font-bold font-mono text-[#00f5d4]">{judge.solution_1_score}<span className="text-xs text-zinc-500">/10</span></span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {judge.solution_1_reasoning}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#091524] border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-medium text-sky-400">Bot B Score</span>
                <span className="text-lg font-bold font-mono text-sky-300">{judge.solution_2_score}<span className="text-xs text-zinc-500">/10</span></span>
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