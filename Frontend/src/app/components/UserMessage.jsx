import React from 'react';

export default function UserMessage({ message, timestamp }) {
  return (
    <div className="flex justify-end w-full">
      <div className="max-w-2xl bg-white/[0.06] border border-white/10 rounded-2xl rounded-tr-sm px-4 py-2.5 backdrop-blur-md shadow-lg">
        <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed">
          {message}
        </p>
        {timestamp && (
          <p className="text-[10px] font-mono text-slate-400 text-right mt-1">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}