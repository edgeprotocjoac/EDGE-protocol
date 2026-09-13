'use client';

import React from 'react';
import Link from 'next/link';
import GlassSurface from '@/components/GlassSurface';

export const AlertsPortfolioSection = () => {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto relative z-10">
      
      {/* ============================================================ */}
      {/* COMBINED SECTION 8, 9 & 10: Momentum Alerts, USDG Portfolio & CTA */}
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
              Real-time Alerts & Portfolio
            </div>
          </GlassSurface>

          <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight leading-tight mb-4 text-white max-w-3xl mx-auto">
            Know when the market moves. One balance for every prediction.
          </h2>
          <p className="text-[14px] md:text-[16px] text-white/60 max-w-xl mx-auto leading-relaxed">
            Never miss a move with instant momentum alerts, track your unified $USDG portfolio, and trade markets happening right now.
          </p>
        </div>

        {/* 3-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          
          {/* ============================================================ */}
          {/* CARD 1 (col-span-6): Section 8 Momentum Trade Alerts         */}
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
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider font-semibold">
                      Momentum Engine
                    </span>
                    <span className="text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold">
                      REAL-TIME ALERTS
                    </span>
                  </div>

                  {/* 4 Alert Triggers List (Clear & Beginner-Friendly Copywriting) */}
                  <div className="space-y-2.5 font-mono text-xs">
                    
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-white font-medium">Large Trade Placed</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        $1,000+ Trade
                      </span>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-white/40" />
                        <span className="text-white font-medium">Fast Odds Shift</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        +25% in 18m
                      </span>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-white/40" />
                        <span className="text-white font-medium">High Trading Activity</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Activity +280%
                      </span>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-white/40" />
                        <span className="text-white font-medium">Market Ending Soon</span>
                      </div>
                      <span className="text-[10px] text-white/70 bg-white/10 border border-white/15 px-2 py-0.5 rounded">
                        Ending in 2 Hours
                      </span>
                    </div>

                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Know When Markets Start Moving</h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Stop refreshing ten different pages. Receive instant notifications when market momentum spikes.
                  </p>
                </div>
              </div>
            </GlassSurface>
          </div>

          {/* ============================================================ */}
          {/* CARD 2 (col-span-6): Section 9 Unified $USDG Portfolio      */}
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
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider font-semibold">
                      Unified Balance
                    </span>
                    <span className="text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold">
                      $USDG PORTFOLIO
                    </span>
                  </div>

                  {/* Portfolio Mockup Box */}
                  <div className="bg-black/50 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl font-mono">
                    
                    <div className="border-b border-white/10 pb-3">
                      <span className="text-[10px] text-white/40 uppercase block mb-1">Available Balance</span>
                      <div className="text-2xl font-bold text-white tracking-tight">
                        $12,450.00 <span className="text-xs text-emerald-400 font-normal">USDG</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                        <span className="text-[10px] text-white/40 uppercase block mb-1">Open Positions</span>
                        <span className="text-white font-bold text-sm">3 Active</span>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                        <span className="text-[10px] text-white/40 uppercase block mb-1">Unrealized PnL</span>
                        <span className="text-emerald-400 font-bold text-sm">+$340.00</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-white/50">Realized Gains</span>
                      <span className="text-emerald-400 font-bold">+$1,240.00 USDG</span>
                    </div>

                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white mb-1">One Balance. Every Prediction.</h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Use unified $USDG liquidity across EDGE Protocol. Track open positions and realized gains in one place.
                  </p>
                </div>
              </div>
            </GlassSurface>
          </div>

          {/* ============================================================ */}
          {/* CARD 3 (col-span-12): Section 10 Built for Now & Launch CTA  */}
          {/* ============================================================ */}
          <div className="md:col-span-12">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={16}
              backgroundOpacity={0.03}
              opacity={0.3}
              className="w-full relative group hover:border-white/20 transition-all"
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="max-w-xl">
                  <span className="inline-block text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold mb-3">
                    ROBINHOOD CHAIN NATIVE
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Built for the market that is happening now.</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                    Prediction markets are not static pages. Experience ultra-fast finality, zero counterparty risk, and 100% on-chain transparency.
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0">
                  <Link href="/markets">
                    <button className="w-full md:w-auto bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] cursor-pointer flex items-center justify-center gap-2">
                      <span>Start Exploring Markets</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </Link>
                </div>

              </div>
            </GlassSurface>
          </div>

        </div>

      </div>
    </section>
  );
};
