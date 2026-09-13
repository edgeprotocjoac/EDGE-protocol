'use client';

import React, { useState } from 'react';
import GlassSurface from '@/components/GlassSurface';

export const TraderExecutionSection = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no'>('yes');
  const [selectedAmount, setSelectedAmount] = useState<number>(500);

  return (
    <section id="trader-execution" className="py-24 px-6 max-w-5xl mx-auto relative z-10">
      
      {/* ============================================================ */}
      {/* COMBINED SECTION 4 & 7: Trader Profiles & 1-Tap Execution     */}
      {/* ============================================================ */}
      <div className="flex flex-col items-center">
        
        {/* Header */}
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
            <div className="px-4 py-1.5 text-[11px] font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Trader Network & Execution
            </div>
          </GlassSurface>

          <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight leading-tight mb-4 text-white max-w-3xl mx-auto">
            Follow traders, not just markets. Trade in one tap.
          </h2>
          <p className="text-[14px] md:text-[16px] text-white/60 max-w-xl mx-auto leading-relaxed">
            Discover top prediction callers with verified track records and execute YES/NO positions directly from the feed.
          </p>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          
          {/* ============================================================ */}
          {/* LEFT BENTO (col-span-6): Section 7 Trader Profiles & Journal */}
          {/* ============================================================ */}
          <div className="md:col-span-6 h-full">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={16}
              backgroundOpacity={0.03}
              opacity={0.3}
              className="w-full h-full relative group hover:border-white/20 transition-all"
            >
              <div className="p-6 flex flex-col justify-between h-full w-full relative z-10 space-y-6">
                
                {/* Profile Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://api.dicebear.com/9.x/avataaars/svg?seed=CryptoWhale"
                        alt="CryptoWhale Profile"
                        className="w-12 h-12 rounded-full border border-white/20 bg-black/60 p-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">@CryptoWhale</span>
                          <span className="text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold">
                            TOP CALLER
                          </span>
                        </div>
                        <span className="text-xs text-white/40">Macro & Crypto Trader</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                        isFollowing
                          ? 'bg-white/10 text-white border-white/20'
                          : 'bg-white text-black hover:bg-neutral-200 border-white'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>

                  {/* 4 Trader Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6 font-mono text-xs">
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                      <div className="text-[10px] text-white/40 uppercase mb-1">Accuracy</div>
                      <div className="text-emerald-400 font-bold text-sm">88% Acc</div>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                      <div className="text-[10px] text-white/40 uppercase mb-1">Lifetime PnL</div>
                      <div className="text-emerald-400 font-bold text-sm">+$12,450 USDG</div>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                      <div className="text-[10px] text-white/40 uppercase mb-1">Win Rate</div>
                      <div className="text-white font-bold text-sm">76% Win</div>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                      <div className="text-[10px] text-white/40 uppercase mb-1">Markets</div>
                      <div className="text-white font-bold text-sm">142 Traded</div>
                    </div>
                  </div>

                  {/* Public Trading Journal */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2 font-semibold">
                      Public Trading Journal
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Opened Position</span>
                        <span className="text-emerald-400 font-bold">BUY YES @ $0.42</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Added Capital</span>
                        <span className="text-white font-bold">+$250.00 USDG</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Status</span>
                        <span className="text-emerald-400 font-bold">Resolved WIN (+68%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Public Trading Reputation</h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Turn every position into an automated public trading journal backed by on-chain smart contract proof.
                  </p>
                </div>
              </div>
            </GlassSurface>
          </div>

          {/* ============================================================ */}
          {/* RIGHT BENTO (col-span-6): Section 4 In-Feed 1-Tap Execution */}
          {/* ============================================================ */}
          <div className="md:col-span-6 h-full">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={16}
              backgroundOpacity={0.03}
              opacity={0.3}
              className="w-full h-full relative group hover:border-white/20 transition-all"
            >
              <div className="p-6 flex flex-col justify-between h-full w-full relative z-10 space-y-6">
                
                {/* 1-Tap Execution Box */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider font-semibold">
                      In-Feed Execution
                    </span>
                    <span className="text-[10px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold">
                      1-TAP TRADE
                    </span>
                  </div>

                  <div className="bg-black/50 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="text-xs font-bold text-white mb-1">
                      FED Cut 50bps in Sept FOMC
                    </div>

                    {/* Side Selector Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedSide('yes')}
                        className={`py-2.5 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer border ${
                          selectedSide === 'yes'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                        }`}
                      >
                        BUY YES @ $0.42
                      </button>

                      <button
                        onClick={() => setSelectedSide('no')}
                        className={`py-2.5 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer border ${
                          selectedSide === 'no'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                            : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                        }`}
                      >
                        BUY NO @ $0.58
                      </button>
                    </div>

                    {/* Preset Amount Selector */}
                    <div>
                      <label className="text-[10px] text-white/40 font-mono uppercase mb-2 block">
                        Select Amount ($USDG)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[50, 100, 500, 1000].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setSelectedAmount(amount)}
                            className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                              selectedAmount === amount
                                ? 'bg-white text-black border-white shadow-md'
                                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary & Confirm Action */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-white/60">Est. Shares</span>
                      <span className="text-white font-bold">
                        ~{Math.round(selectedAmount / (selectedSide === 'yes' ? 0.42 : 0.58))} shares
                      </span>
                    </div>

                    <button
                      className="w-full bg-white hover:bg-neutral-200 text-black py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Confirm & Execute Position</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-1">From Callout to Position in 1 Tap</h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Trade YES or NO instantly in $USDG without leaving the timeline. No page redirects or complex forms required.
                  </p>
                </div>
              </div>
            </GlassSurface>
          </div>

        </div>

      </div>
    </section>
  );
};
