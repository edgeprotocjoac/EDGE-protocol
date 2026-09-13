import React from 'react';
import GlassSurface from '@/components/GlassSurface';

export const FeaturesBento = () => {
  return (
    <section id="features" className="py-28 px-6 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <GlassSurface
          width="auto"
          height="auto"
          borderRadius={999}
          borderWidth={0.05}
          backgroundOpacity={0.05}
          opacity={0.3}
          className="inline-flex mb-6"
        >
          <div className="px-3 py-1 text-[11px] font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-1.5 h-1.5 fill-white animate-pulse" viewBox="0 0 6 6">
              <circle cx="3" cy="3" r="3" />
            </svg>
            Verified Callouts
          </div>
        </GlassSurface>
        <h2 className="text-[32px] md:text-[44px] font-bold leading-tight mb-4 text-white">
          See the trade behind the take.
        </h2>
        <p className="text-[14px] md:text-[16px] text-white/60 max-w-xl mx-auto leading-relaxed">
          Anyone can post an opinion. EDGE Protocol lets traders attach a real prediction-market position to their callout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Bento 1: YES or NO Conviction (WIDE CARD: col-span-8) */}
        <div className="md:col-span-8 h-full">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full h-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col md:flex-row gap-6 w-full h-full relative z-10">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"></div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold mb-3">
                    VERIFIED ON-CHAIN
                  </span>
                  <h3 className="text-[17px] font-semibold mb-2 text-white">YES or NO Conviction</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed max-w-[260px]">
                    Anyone can post an opinion. Traders attach explicit conviction directions (BUY YES or BUY NO) backed by real capital to every callout.
                  </p>
                </div>
                <div className="text-[11px] text-white/30 font-mono mt-4">
                  Settled with $USDG on Robinhood Chain
                </div>
              </div>

              {/* Visual Right Side: Vertical Top & Bottom Stack (BUY YES Top, BUY NO Bottom) */}
              <div className="flex-1 flex flex-col justify-center gap-2.5 relative my-auto px-1 max-w-[240px] mx-auto w-full">
                {/* BUY YES Pill (Top) */}
                <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-3 shadow-xl flex items-center justify-between h-12 w-full group-hover:border-emerald-500/50 transition-all">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 tracking-wider">
                    BUY YES
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">67%</span>
                </div>

                {/* BUY NO Pill (Bottom) */}
                <div className="bg-black/60 border border-rose-500/30 rounded-xl p-3 shadow-xl flex items-center justify-between h-12 w-full group-hover:border-rose-500/50 transition-all">
                  <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/40 tracking-wider">
                    BUY NO
                  </span>
                  <span className="text-xs text-rose-400 font-mono font-bold">33%</span>
                </div>

                {/* Blur backdrop behind visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[80px] bg-white/10 blur-[40px] z-0 pointer-events-none"></div>
              </div>
            </div>
          </GlassSurface>
        </div>

        {/* Bento 2: Entry Price, Size & Probability (COMPACT CARD: col-span-4) */}
        <div className="md:col-span-4 h-full">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full h-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col justify-between h-full w-full relative z-10">
              <div className="space-y-2.5 mb-4">
                <div className="h-9 rounded-lg border border-white/10 bg-black/40 flex items-center px-3 justify-between">
                  <span className="text-[10px] text-white/50 font-mono">Entry Price</span>
                  <span className="text-[11px] text-white font-bold font-mono">$0.42 / share</span>
                </div>
                
                <div className="h-9 rounded-lg border border-white/30 bg-black/60 flex items-center px-3 justify-between shadow-[0_0_12px_rgba(255,255,255,0.12)]">
                  <span className="text-[10px] text-white/50 font-mono">Position Size</span>
                  <span className="text-[11px] text-white font-bold font-mono">$500.00 USDG</span>
                </div>
                
                <div className="h-9 rounded-lg border border-white/10 bg-black/40 flex items-center px-3 justify-between">
                  <span className="text-[10px] text-white/50 font-mono">Current Odds</span>
                  <span className="text-[11px] text-white font-bold font-mono">67% YES</span>
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-[15px] font-semibold mb-1 text-white">Entry & Size Transparency</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  Inspect exact execution prices and real capital amounts committed to the market.
                </p>
              </div>
            </div>
          </GlassSurface>
        </div>

        {/* Bento 3: Live PnL & Settlement (COMPACT CARD: col-span-5) */}
        <div className="md:col-span-5 h-full">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full h-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col w-full h-full relative z-10 justify-between">
              {/* Visual area */}
              <div className="h-36 mb-4 bg-black/40 rounded-xl border border-white/10 relative overflow-hidden p-4 flex flex-col items-center justify-center">
                <div className="text-[10px] text-white/50 mb-2 font-mono uppercase tracking-wider">Live Position Tracking</div>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    +$340.00 <span className="text-xs text-emerald-400/80 font-normal">(+68%)</span>
                  </div>
                </div>

                <div className="w-full px-4 flex items-center justify-between text-[10px] font-mono text-white/40 border-t border-white/5 pt-2">
                  <span>Resolution: 18h 42m</span>
                  <span className="text-white/60">Live</span>
                </div>

                <div className="absolute bottom-0 w-full h-[50px] bg-gradient-to-t from-white/10 to-transparent blur-[15px]"></div>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold mb-1 text-white">Live PnL & Countdown</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  Track unrealized gains with transparent countdown timers to settlement.
                </p>
              </div>
            </div>
          </GlassSurface>
        </div>

        {/* Bento 4: No Screenshots, No Fake Numbers (WIDE CARD: col-span-7) */}
        <div className="md:col-span-7 h-full">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full h-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col justify-between w-full h-full relative z-10">
              
              {/* Visual Illustration: Fake Screenshot vs Real On-Chain Contract Proof */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 relative">
                {/* Left: Fake PNG Screenshot (Crossed / Disabled) */}
                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 flex flex-col justify-between h-28 relative opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Fake Screenshot
                    </span>
                    <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono">
                      Unverified
                    </span>
                  </div>
                  <div className="text-[11px] text-white/40 line-through font-mono">
                    +$50,000 PnL (Edited)
                  </div>
                  <div className="text-[9px] text-white/30 font-mono">
                    No Market Connection
                  </div>
                </div>

                {/* Right: Real On-Chain Verified Position (Glowing Emerald) */}
                <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between h-28 relative shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/60 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      On-Chain State
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">+$340.00 USDG</span>
                    <span className="text-white/60">67% YES</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-white/50 font-mono border-t border-white/5 pt-1.5">
                    <span>0x9a6e...f5a</span>
                    <span className="text-emerald-400 font-bold">1-Click Trade</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold mb-1 text-white">No Screenshots. No Fake Numbers.</h3>
                <p className="text-[12px] text-white/40 leading-relaxed max-w-[340px]">
                  100% on-chain transparency. Trade or counter any callout directly from the feed without leaving the timeline.
                </p>
              </div>
            </div>
          </GlassSurface>
        </div>

      </div>
    </section>
  );
};
