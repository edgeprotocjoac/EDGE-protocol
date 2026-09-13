'use client';

import React from 'react';
import GlassSurface from '@/components/GlassSurface';

export const MarketSignalsSection = () => {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto relative z-10">
      
      {/* ============================================================ */}
      {/* SECTION 3: Find the market before everyone starts talking about it */}
      {/* ============================================================ */}
      <div className="flex flex-col items-center">
        
        {/* Section 3 Header */}
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
              Early Market Signals
            </div>
          </GlassSurface>

          <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight leading-tight mb-4 text-white max-w-3xl mx-auto">
            Find the market before everyone starts talking about it.
          </h2>
          <p className="text-[14px] md:text-[16px] text-white/60 max-w-xl mx-auto leading-relaxed">
            EDGE Protocol surfaces the markets getting hot before they reach mainstream timeline noise.
          </p>
        </div>

        {/* 6 Discovery Signal Bento Cards (Pure Typography, No Icons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-12">
          
          {/* Signal 1: Breaking Markets */}
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/30 font-bold">01</span>
                <span className="text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold">
                  NEW LISTING
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Breaking Markets</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Instant alerts the moment a high-conviction prediction market is deployed on-chain.
              </p>
            </div>
          </GlassSurface>

          {/* Signal 2: Probability Spikes */}
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/30 font-bold">02</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  +25 pts in 18m
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Probability Spikes</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Detect rapid shifts in market-implied odds driven by aggressive orderbook buying.
              </p>
            </div>
          </GlassSurface>

          {/* Signal 3: Volume Surges */}
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/30 font-bold">03</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Vol +280%
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Volume Surges</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Spot sudden spikes in trading volume and liquidity pooling before prices move.
              </p>
            </div>
          </GlassSurface>

          {/* Signal 4: Large Trades */}
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/30 font-bold">04</span>
                <span className="text-[10px] text-white/70 font-mono bg-white/10 border border-white/15 px-2 py-0.5 rounded">
                  $1,000+ Trade
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Large Trades</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Track high-stakes capital allocations executed by proven top traders.
              </p>
            </div>
          </GlassSurface>

          {/* Signal 5: New Traders */}
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/30 font-bold">05</span>
                <span className="text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold">
                  NEW PROFILES
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">New Traders</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Discover rising prediction callers establishing early public track records.
              </p>
            </div>
          </GlassSurface>

          {/* Signal 6: Markets Ending Soon */}
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={16}
            backgroundOpacity={0.03}
            opacity={0.3}
            className="w-full relative group hover:border-white/20 transition-all"
          >
            <div className="p-6 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/30 font-bold">06</span>
                <span className="text-[9px] bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono font-semibold">
                  FINAL HOURS
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Markets Ending Soon</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                High-resolution markets nearing countdown expiry and imminent $USDG payouts.
              </p>
            </div>
          </GlassSurface>
        </div>

        {/* Bottom Banner Callout */}
        <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
          <p className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Know where attention is moving before the feed becomes crowded.
          </p>
        </div>

      </div>
    </section>
  );
};
