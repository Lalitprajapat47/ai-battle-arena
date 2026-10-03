import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// Reveals text progressively like a typewriter. Duration scales gently with
// length but is capped so long responses don't take forever to finish.
function useTypewriter(text) {
  const [displayed, setDisplayed] = useState('');
  const prevTextRef = useRef('');

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      prevTextRef.current = '';
      return;
    }

    // If the text hasn't actually changed (e.g. parent re-render), don't restart.
    if (text === prevTextRef.current) return;
    prevTextRef.current = text;

    setDisplayed('');
    const total = text.length;
    const duration = Math.min(2200, Math.max(500, total * 3.5)); // ms
    const steps = Math.max(1, Math.round(duration / 16)); // ~60fps
    const chunk = Math.max(1, Math.ceil(total / steps));

    let i = 0;
    const id = setInterval(() => {
      i += chunk;
      setDisplayed(text.slice(0, i));
      if (i >= total) {
        clearInterval(id);
      }
    }, 16);

    return () => clearInterval(id);
  }, [text]);

  const isTyping = text && displayed.length < text.length;
  return [displayed, isTyping];
}

function TypingCursor() {
  return (
    <span className="inline-block w-[2px] h-[1em] align-middle bg-white/80 ml-0.5 animate-pulse" />
  );
}

function CodeBlock({ className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const text = String(children).replace(/\n$/, '');

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl border border-white/10 bg-[#03060c] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.03] border-b border-white/5 text-[11px] font-mono text-slate-400">
        <span>{className?.replace('language-', '') || 'code'}</span>
        <button type="button" onClick={copy} className="hover:text-white transition-colors cursor-pointer">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function ArenaResponse({ solution1, solution2, judge, judgeModel }) {
  const [copiedId, setCopiedId] = useState(null);

  const [sol1Display, sol1Typing] = useTypewriter(solution1);
  const [sol2Display, sol2Typing] = useTypewriter(solution2);
  const [reasoning1Display, reasoning1Typing] = useTypewriter(judge?.solution_1_reasoning || '');
  const [reasoning2Display, reasoning2Typing] = useTypewriter(judge?.solution_2_reasoning || '');

  useEffect(() => {
    hljs.highlightAll();
  }, [sol1Display, sol2Display]);

  const copyText = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isSol1Winner = judge && Number(judge.solution_1_score) > Number(judge.solution_2_score);
  const isSol2Winner = judge && Number(judge.solution_2_score) > Number(judge.solution_1_score);

  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-base font-semibold mt-3 mb-2 text-white" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-sm font-semibold mt-2.5 mb-1.5 text-white" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xs font-semibold mt-2 mb-1 text-slate-300" {...props} />,
    p: ({ node, ...props }) => <p className="mb-2.5 leading-relaxed text-slate-300 text-xs sm:text-sm font-normal" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2.5 text-slate-300 space-y-1 text-xs sm:text-sm" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2.5 text-slate-300 space-y-1 text-xs sm:text-sm" {...props} />,
    code: ({ node, inline, className, children, ...props }) => {
      return !inline ? (
        <CodeBlock className={className} {...props}>{children}</CodeBlock>
      ) : (
        <code className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[11px] font-mono border border-white/15" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Solution 1 */}
        <div className={`flex flex-col rounded-2xl p-5 transition-all ${isSol1Winner ? 'miracle-card-winner' : 'miracle-card'
          }`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isSol1Winner ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-slate-500'}`} />
              <span className="text-xs font-mono font-semibold text-white tracking-wide">
                Mistral Large (Alpha)
              </span>
              {isSol1Winner && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/30">
                  ✦ WINNER
                </span>
              )}
            </div>
            <button
              onClick={() => copyText(solution1, 's1')}
              className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedId === 's1' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 overflow-x-auto text-slate-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {sol1Display}
            </ReactMarkdown>
            {sol1Typing && <TypingCursor />}
          </div>
        </div>

        {/* Solution 2 */}
        <div className={`flex flex-col rounded-2xl p-5 transition-all ${isSol2Winner ? 'miracle-card-winner' : 'miracle-card'
          }`}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isSol2Winner ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-slate-500'}`} />
              <span className="text-xs font-mono font-semibold text-white tracking-wide">
                Cohere Command A
              </span>
              {isSol2Winner && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/30">
                  ✦ WINNER
                </span>
              )}
            </div>
            <button
              onClick={() => copyText(solution2, 's2')}
              className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedId === 's2' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 overflow-x-auto text-slate-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {sol2Display}
            </ReactMarkdown>
            {sol2Typing && <TypingCursor />}
          </div>
        </div>

      </div>

      {/* Autonomous Judge Strip */}
      {judge && (
        <div className="miracle-card rounded-2xl p-4 border border-white/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-white">✦</span>
            <h4 className="text-xs font-mono font-semibold text-white tracking-wider uppercase">
              Judge Evaluation Verdict
            </h4>
            {judgeModel && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                {judgeModel}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300">Mistral Score</span>
                <span className="text-sm font-bold font-mono text-white">{judge.solution_1_score}<span className="text-slate-500 text-xs">/10</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {reasoning1Display}
                {reasoning1Typing && <TypingCursor />}
              </p>
            </div>

            <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300">Cohere Score</span>
                <span className="text-sm font-bold font-mono text-white">{judge.solution_2_score}<span className="text-slate-500 text-xs">/10</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {reasoning2Display}
                {reasoning2Typing && <TypingCursor />}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}