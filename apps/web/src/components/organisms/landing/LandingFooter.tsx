'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const EDGE_CA = process.env.NEXT_PUBLIC_EDGE_CA || '0x9a6e4fdce052186e942e8267424f1df0ded3ff5a';

export const LandingFooter = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyCA = () => {
    navigator.clipboard.writeText(EDGE_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="border-t border-white/5 bg-[#050507] py-10 px-6">
      <div className="container max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Top Row: Full Contract Address (CA) Bar (Copyable & Never Truncated) */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold bg-white/10 border border-white/20 px-2.5 py-1 rounded shrink-0">
              Contract Address (CA)
            </span>
            <span className="text-xs sm:text-sm font-mono text-white/80 select-all font-semibold break-all">
              {EDGE_CA}
            </span>
          </div>

          <button
            onClick={handleCopyCA}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border shrink-0 flex items-center gap-2 ${
              copied
                ? 'bg-white text-black border-white'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 011.927-.184" />
                </svg>
                <span>Copy CA</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Row: Brand & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Image unoptimized src="/logo.png?v=2" alt="EDGE Protocol Logo" width={20} height={20} className="rounded-full bg-white ring-1 ring-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
              <span className="font-bold text-sm tracking-tight">EDGE Protocol</span>
            </div>
            <span className="text-white/20">|</span>
            <p className="text-[12px] text-white/40">
              &copy; {new Date().getFullYear()} EDGE Protocol. All rights reserved.
            </p>
          </div>

          {/* Links & Socials */}
          <div className="flex items-center gap-6">
            <Link href="/markets" className="text-[12px] text-white/50 hover:text-white transition-colors">
              Markets
            </Link>
            <Link href="/docs" className="text-[12px] text-white/50 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="/privacy" className="text-[12px] text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[12px] text-white/50 hover:text-white transition-colors">
              Terms
            </Link>
            <a href="https://x.com/Edgeprotocjoac" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors" aria-label="X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
