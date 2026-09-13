'use client';

import React, { useState } from 'react';
import GlassSurface from '@/components/GlassSurface';

export const SocialTradePreviewSection = () => {
  const [activeTab, setActiveTab] = useState<'callouts' | 'following' | 'trending'>('callouts');
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <section id="feed" className="py-24 px-6 max-w-5xl mx-auto relative z-10">
      
      {/* ============================================================ */}
      {/* SECTION 2: Prediction markets, built like a social feed.     */}
      {/* ============================================================ */}
      <div className="flex flex-col items-center">
        {/* Section 2 Badge (Monochrome B&W Primary) */}
        <div className="text-center mb-12">
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
              <svg className="w-1.5 h-1.5 fill-white animate-pulse" viewBox="0 0 6 6">
                <circle cx="3" cy="3" r="3" />
              </svg>
              Social Feed Discovery
            </div>
          </GlassSurface>

          <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight leading-tight mb-4 text-white">
            Prediction markets, built like a social feed.
          </h2>
          <p className="text-[14px] md:text-[16px] text-white/60 max-w-xl mx-auto leading-relaxed">
            Prediction-market discovery should feel as easy as scrolling your feed.
          </p>
        </div>

        {/* Tab Controls Preview */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 mb-10">
          <button
            onClick={() => setActiveTab('callouts')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'callouts'
                ? 'bg-white/20 text-white shadow-sm border border-white/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Callouts
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'following'
                ? 'bg-white/20 text-white shadow-sm border border-white/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'trending'
                ? 'bg-white/20 text-white shadow-sm border border-white/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Trending
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          </button>
        </div>

        {/* Section 2 Bento Grid (3 Showcase Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
          
          {/* Card 1: Scroll Traders Activity */}
          <div className="md:col-span-7">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={16}
              backgroundOpacity={0.03}
              opacity={0.3}
              className="w-full relative group hover:border-white/20 transition-all h-full"
            >
              <div className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2 font-semibold">
                    Real-time Feed
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Scroll What Traders Are Watching</h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-6">
                    See live prediction callouts, analysis, and position sizes updated dynamically as markets react.
                  </p>
                </div>

                {/* Card Graphic Mockup */}
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://api.dicebear.com/9.x/avataaars/svg?seed=AlphaHunter"
                        alt="AlphaHunter Avatar"
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">@AlphaHunter</div>
                        <div className="text-[10px] text-white/40">2m ago</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-snug font-medium">
                    FOMC rate cut odds are underpriced. Taking a heavy position on YES.
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-emerald-400 font-bold">BUY YES @ $0.42</span>
                    <span className="text-white/60">Size: $500.00 USDG</span>
                  </div>
                </div>
              </div>
            </GlassSurface>
          </div>

          {/* Card 2: Follow Trusted Callers */}
          <div className="md:col-span-5">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={16}
              backgroundOpacity={0.03}
              opacity={0.3}
              className="w-full relative group hover:border-white/20 transition-all h-full"
            >
              <div className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2 font-semibold">
                    Trader Network
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Follow People You Trust</h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-6">
                    Filter noise and build a curated feed of top prediction callers with proven accuracy records.
                  </p>
                </div>

                {/* Follow Widget Mockup */}
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/9.x/avataaars/svg?seed=CryptoWhale"
                      alt="CryptoWhale Avatar"
                      className="w-10 h-10 rounded-full border border-white/20"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">@CryptoWhale</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">88% Acc • +$1,240 PnL</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isFollowing
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-white text-black hover:bg-neutral-200 border-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </GlassSurface>
          </div>

          {/* Card 3: Track Real-time Position Movement */}
          <div className="md:col-span-12">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={16}
              backgroundOpacity={0.03}
              opacity={0.3}
              className="w-full relative group hover:border-white/20 transition-all"
            >
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2 font-semibold">
                    Live Updates
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Watch Positions Move in Real Time</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Track updates, odds swings, and outcome resolutions directly on interactive market cards without leaving your social timeline.
                  </p>
                </div>

                <div className="w-full flex-1 max-w-xl bg-black/50 border border-white/10 rounded-xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                    <span className="font-bold text-white tracking-tight">FED Cut 50bps in Sept FOMC</span>
                    <span className="text-emerald-400 font-mono font-bold shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs">
                      +$340.00 PnL
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-white h-full w-[67%]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white shrink-0">67% YES</span>
                  </div>
                </div>
              </div>
            </GlassSurface>
          </div>

        </div>
      </div>

    </section>
  );
};
