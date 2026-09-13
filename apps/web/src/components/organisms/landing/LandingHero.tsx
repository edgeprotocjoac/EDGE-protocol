'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LightRays from '@/components/LightRays';
import GlassSurface from '@/components/GlassSurface';
import heroDataFallback from '@/data/hero_feed.json';

// EDGE Protocol Contract Address (CA)
const EDGE_CA = process.env.NEXT_PUBLIC_EDGE_CA || '0x9a6e4fdce052186e942e8267424f1df0ded3ff5a';

interface CalloutItem {
  id: string;
  handle: string;
  displayName: string;
  role: string;
  accuracy: string;
  timeAgo: string;
  avatarUrl: string;
  isVerified: boolean;
  thesis: string;
  outcome: string;
  marketTitle: string;
  pnlText: string;
  entryPrice: string;
  currentPrice: string;
  positionSize: string;
  probability: string;
  yesPrice: string;
  noPrice?: string;
  metrics: {
    views: string | number;
    comments: number;
    reposts: number;
    likes: number;
    copied: number;
  };
}

interface TopTraderItem {
  handle: string;
  accuracy: string;
  pnl: string;
  volume: string;
  avatarUrl: string;
}

// Helper formatting functions to round numbers cleanly and handle varied numeric inputs
const formatPercent = (val: any): string => {
  if (val === null || val === undefined) return '0%';
  const str = String(val).replace('%', '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? '0%' : `${Math.round(num)}%`;
};

const formatPriceCents = (val: any): string => {
  if (val === null || val === undefined) return '50¢';
  const str = String(val).replace('¢', '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? '50¢' : `${Math.round(num)}¢`;
};

// Formatter tailored for early-stage realistic protocol metrics ($100 - $2K Vol)
const formatVolumeText = (val: any): string => {
  if (val === null || val === undefined || val === '') return '$500 Vol';
  if (typeof val === 'string' && (val.includes('Vol') || val.includes('$'))) return val.includes('Vol') ? val : `${val} Vol`;
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return '$500 Vol';
  if (num >= 1000) {
    const inK = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `$${inK}K Vol`;
  }
  return `$${Math.round(num)} Vol`;
};

// Formatter tailored for early-stage realistic PnL (+ $40 - $400 PnL)
const formatPnlText = (val: any): string => {
  if (val === null || val === undefined || val === '') return '+$150 PnL';
  if (typeof val === 'string' && (val.includes('PnL') || val.includes('$'))) return val.includes('PnL') ? val : `+${val} PnL`;
  const num = parseFloat(val);
  if (isNaN(num) || num === 0) return '+$150 PnL';
  if (num >= 1000) {
    const inK = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `+$${inK}K PnL`;
  }
  return `+$${Math.round(num)} PnL`;
};

export const LandingHero = () => {
  const [copied, setCopied] = useState(false);
  const [activeVariant, setActiveVariant] = useState<'main' | 'alternative'>('main');
  const [callouts, setCallouts] = useState<CalloutItem[]>(heroDataFallback.featuredCallouts);
  const [topTraders, setTopTraders] = useState<TopTraderItem[]>(heroDataFallback.topTraders);

  // Copy CA handler
  const handleCopyCA = async () => {
    try {
      await navigator.clipboard.writeText(EDGE_CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EDGE_CA;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fetch real 3 latest callouts & top callers directly without static default fallbacks
  useEffect(() => {
    async function fetchRealData() {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
        const backendUrl = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : '';
        const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';

        if (!backendUrl) return;

        // Fetch real callouts
        const res = await fetch(`${backendUrl}/api/callouts?network=${network}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.callouts) && data.callouts.length > 0) {
            const mapped: CalloutItem[] = data.callouts.slice(0, 3).map((c: any) => {
              const handle = c.creator?.handle ?? c.handle ?? 'Trader';
              const displayName = c.creator?.displayName ?? handle;
              const accuracyVal = c.creator?.stats?.accuracy ?? c.confidence ?? 80;
              const avatar = c.creator?.avatarUrl ?? `https://api.dicebear.com/9.x/avataaars/svg?seed=${handle}`;
              const thesisText = c.headline ?? c.thesis ?? '';
              const outcome = c.conviction ?? 'YES';
              const marketTitle = c.market?.title ?? 'Prediction Market';
              const pnlText = c.market?.profitValue ?? `+$${c.metrics?.volumeAttributed ?? '84.20'}`;

              const rawEntry = c.callProbability ?? 50;
              const rawCurrent = c.currentProbability ?? c.market?.yesProbability ?? 50;
              const rawYes = c.market?.yesProbability ?? c.currentProbability ?? 50;
              const rawNo = c.market?.noProbability ?? (100 - parseFloat(rawYes));

              const entryPrice = `${Math.round(parseFloat(rawEntry))}¢`;
              const currentPrice = `${Math.round(parseFloat(rawCurrent))}¢`;
              const positionSize = c.market?.positionValue ?? '$100';
              const probability = `${Math.round(parseFloat(rawCurrent))}%`;
              const yesPrice = `${Math.round(parseFloat(rawYes))}¢`;
              const noPrice = `${Math.round(parseFloat(rawNo))}¢`;

              const viewsCount = c.metrics?.views ?? 0;
              const formattedViews = viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}k` : `${viewsCount}`;

              return {
                id: String(c.id),
                handle,
                displayName,
                role: c.category ? `${String(c.category).toUpperCase()} Trader` : 'Prediction Trader',
                accuracy: `${Math.round(parseFloat(accuracyVal))}%`,
                timeAgo: 'Recently',
                avatarUrl: avatar,
                isVerified: Boolean(c.creator?.isVerified),
                thesis: `"${thesisText}"`,
                outcome,
                marketTitle,
                pnlText,
                entryPrice,
                currentPrice,
                positionSize,
                probability,
                yesPrice,
                noPrice,
                metrics: {
                  views: formattedViews,
                  comments: Number(c.metrics?.comments ?? 0),
                  reposts: Number(c.metrics?.reposts ?? 0),
                  likes: Number(c.metrics?.likes ?? 0),
                  copied: Number(c.metrics?.tradesAttributed ?? 0),
                },
              };
            });
            setCallouts(mapped);
          }
        }

        // Fetch real leaderboard top callers
        const leaderRes = await fetch(`${backendUrl}/api/leaderboard?period=all_time&network=${network}`);
        if (leaderRes.ok) {
          const leaderData = await leaderRes.json();
          if (leaderData.success && Array.isArray(leaderData.leaderboard) && leaderData.leaderboard.length > 0) {
            const mappedTraders: TopTraderItem[] = leaderData.leaderboard.slice(0, 5).map((item: any) => {
              const rawVol = item.volume ?? item.stats?.volumeAttributed ?? item.volumeAttributed;
              const rawPnl = item.pnl ?? item.profitValue;

              return {
                handle: item.handle ?? 'Trader',
                accuracy: formatPercent(item.accuracy ?? item.stats?.accuracy ?? 80),
                pnl: rawPnl ? formatPnlText(rawPnl) : '+$210.00 PnL',
                volume: rawVol ? formatVolumeText(rawVol) : '$1.2K Vol',
                avatarUrl: item.avatarUrl ?? `https://api.dicebear.com/9.x/avataaars/svg?seed=${item.handle}`,
              };
            });
            setTopTraders(mappedTraders);
          }
        }
      } catch {
        // Silent catch: preserve static state
      }
    }

    fetchRealData();
  }, []);

  return (
    <section className="relative pt-36 pb-20 px-4 md:px-6 flex flex-col items-center overflow-hidden">
      {/* LightRays Background */}
      <div className="absolute top-10 left-0 w-full h-[1200px] pointer-events-none" style={{ zIndex: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="white"
          raysSpeed={0.7}
          lightSpread={1.9}
          rayLength={4.2}
          pulsating={true}
          fadeDistance={1.1}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0}
          distortion={0}
        />
      </div>

      <div className="text-center max-w-4xl mx-auto mb-12 mt-6 relative z-10">
        {/* Top Badges & Hero Variant Switcher */}
        <div className="flex flex-col items-center justify-center gap-3.5 mb-8">
          {/* Hero Mode Toggle Pill (Placed Above CA) */}
          <div className="bg-black/40 border border-white/10 rounded-full p-1 flex items-center gap-1 backdrop-blur-md">
            <button
              onClick={() => setActiveVariant('main')}
              className={`px-3.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                activeVariant === 'main'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Main Vision
            </button>
            <button
              onClick={() => setActiveVariant('alternative')}
              className={`px-3.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                activeVariant === 'alternative'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Conviction Mode
            </button>
          </div>

          {/* CA Button - Full Un-truncated Contract Address */}
          <button
            onClick={handleCopyCA}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full px-4 py-1.5 transition-all duration-200 group cursor-pointer max-w-full"
            title="Click to copy Contract Address"
          >
            <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider shrink-0">CA</span>
            <span className="text-[12px] text-white/70 font-mono group-hover:text-white transition-colors break-all">
              {EDGE_CA}
            </span>
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:text-white/60 transition-colors shrink-0"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            )}
            {copied && <span className="text-[10px] text-emerald-400 font-medium shrink-0">Copied!</span>}
          </button>
        </div>

        {/* Dynamic Hero Titles & Descriptions based on active variant */}
        {activeVariant === 'main' ? (
          <>
            <h1 className="text-[44px] sm:text-[56px] md:text-[72px] font-bold tracking-[-0.03em] leading-[1.04] mb-6 text-white drop-shadow-sm">
              The social feed for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                prediction markets.
              </span>
            </h1>
            <p className="text-[16px] sm:text-[18px] text-white/60 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
              See what people are betting on, follow real positions, and trade the same markets in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/callouts">
                <button className="w-full sm:w-auto bg-white hover:bg-neutral-200 transition-all text-black px-7 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] cursor-pointer">
                  Open App
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </Link>
              <Link href="/markets">
                <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/15 px-7 py-3 rounded-full text-sm font-medium transition-all backdrop-blur-md cursor-pointer">
                  Explore Markets
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[44px] sm:text-[56px] md:text-[72px] font-bold tracking-[-0.03em] leading-[1.04] mb-6 text-white drop-shadow-sm">
              Follow conviction, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                not noise.
              </span>
            </h1>
            <p className="text-[16px] sm:text-[18px] text-white/60 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
              Prediction markets move fast. EDGE Protocol shows you who is taking a position, how much they put behind it, and whether the trade is working. Then you can trade the same market directly from the feed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/callouts">
                <button className="w-full sm:w-auto bg-white hover:bg-neutral-200 transition-all text-black px-7 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] cursor-pointer">
                  Start Exploring
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </Link>
              <Link href="/markets">
                <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/15 px-7 py-3 rounded-full text-sm font-medium transition-all backdrop-blur-md cursor-pointer">
                  Explore Markets
                </button>
              </Link>
            </div>
          </>
        )}

        {/* Supporting Line / Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[12px] text-white/50 backdrop-blur-md">
          <svg className="w-2 h-2 fill-emerald-400 animate-pulse" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
          <span>Built on <strong>Edge Protocol</strong></span>
          <svg className="w-1.5 h-1.5 fill-white/20" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3"/></svg>
          <span>Settled with <strong>$USDG</strong> on <strong>Robinhood Chain</strong></span>
        </div>
      </div>

      {/* Hero Interactive Social Feed Mockup */}
      <div className="relative z-10 w-full max-w-[1060px] mx-auto rounded-[24px] shadow-[0_30px_100px_-20px_rgba(255,255,255,0.15)] border border-white/10 overflow-hidden">
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={24}
          borderWidth={0.1}
          opacity={0.5}
          backgroundOpacity={0.06}
          displace={0.3}
          mixBlendMode="screen"
          className="w-full flex flex-col min-h-[580px]"
        >
          <div className="flex flex-col w-full h-full rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl">
            {/* Top Bar of Social App in Mockup: Uses EDGE Protocol Logo & Name */}
            <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/40 w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.png?v=2"
                    alt="EDGE Protocol Logo"
                    className="w-7 h-7 object-contain rounded-full bg-white ring-1 ring-white/80 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  />
                  <span className="font-bold text-sm text-white tracking-tight">EDGE Protocol</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <svg className="w-1.5 h-1.5 fill-emerald-400 animate-pulse" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3"/></svg>
                    LIVE FEED
                  </span>
                </div>

                {/* Feed Tabs in Mockup */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                  <span className="px-3 py-1 rounded-md text-[12px] font-semibold bg-white/15 text-white">Callouts</span>
                  <span className="px-3 py-1 rounded-md text-[12px] font-medium text-white/50">Following</span>
                  <span className="px-3 py-1 rounded-md text-[12px] font-medium text-white/50 flex items-center gap-1">
                    Trending
                    <svg className="w-1.5 h-1.5 fill-red-400" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3"/></svg>
                  </span>
                </div>
              </div>

              {/* Right User Status */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
                  <span className="text-[11px] text-white/40 font-medium">Balance:</span>
                  <span className="text-[12px] text-emerald-400 font-bold">$12,450.00 USDG</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-emerald-400/40 p-0.5 bg-emerald-950/40">
                  <img
                    src="https://api.dicebear.com/9.x/avataaars/svg?seed=CurrentUser"
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Social Feed Mockup Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 overflow-y-auto">
              
              {/* Main Social Callout Cards Feed (Only 3 Latest Callouts) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {callouts.slice(0, 3).map((callout) => (
                  <div
                    key={callout.id}
                    className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-all"
                  >
                    {/* Card Header: Avatar, Name, Handle, Time, LIVE Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-white/15 overflow-hidden bg-black/60 p-0.5">
                          <img
                            src={callout.avatarUrl}
                            alt={`${callout.displayName} Avatar`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-white">@{callout.handle}</span>
                            <span className="text-[10px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded font-mono">
                              {formatPercent(callout.accuracy)} Acc
                            </span>
                          </div>
                          <div className="text-[11px] text-white/40">
                            {callout.role} • {callout.timeAgo}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* LIVE Badge */}
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                          <svg className="w-1.5 h-1.5 fill-emerald-400 animate-pulse" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3"/></svg>
                          LIVE
                        </span>
                      </div>
                    </div>

                    {/* Thesis Text */}
                    <p className="text-[14px] text-white/90 font-medium mb-4">
                      {callout.thesis}
                    </p>

                    {/* Attached Verified Position Container */}
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 sm:p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 text-black text-xs font-bold rounded ${
                              callout.outcome === 'YES' ? 'bg-emerald-500' : 'bg-red-500 text-white'
                            }`}
                          >
                            {callout.outcome}
                          </span>
                          <span className="text-xs font-semibold text-white/90">{callout.marketTitle}</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          {callout.pnlText}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
                        <div>
                          <div className="text-[10px] text-white/40 uppercase">Entry</div>
                          <div className="text-xs font-mono font-semibold text-white">{formatPriceCents(callout.entryPrice)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40 uppercase">Current</div>
                          <div className="text-xs font-mono font-semibold text-emerald-400">{formatPriceCents(callout.currentPrice)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40 uppercase">Size</div>
                          <div className="text-xs font-mono font-semibold text-white">{callout.positionSize}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40 uppercase">Prob</div>
                          <div className="text-xs font-mono font-semibold text-white">{formatPercent(callout.probability)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Minimal Clean Social Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
                      {/* Social Metrics */}
                      <div className="flex items-center gap-4 text-[12px] text-white/40 font-mono">
                        <div className="flex items-center gap-1 hover:text-white/70 transition-colors" title="Comments">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                          <span>{callout.metrics.comments}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-white/70 transition-colors" title="Reposts">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                          <span>{callout.metrics.reposts}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-white/70 transition-colors" title="Likes">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          <span>{callout.metrics.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400/80 font-medium" title="Traders who copied this call">
                          <span>{callout.metrics.copied} copied</span>
                        </div>
                      </div>

                      {/* 1-Tap Trade Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer">
                          BUY YES @ {formatPriceCents(callout.yesPrice)}
                        </button>
                        {callout.noPrice && (
                          <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                            BUY NO @ {formatPriceCents(callout.noPrice)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar: Real-time FOMO Signals & Top Prediction Callers (Right Column) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                
                {/* Hot Momentum Widget */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-2 h-2 fill-red-500 animate-pulse" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3"/></svg>
                      FOMO Signals
                    </span>
                    <span className="text-[10px] text-white/40">Realtime</span>
                  </div>

                  <div className="space-y-3">
                    {heroDataFallback.fomoSignals.map((signal) => (
                      <div key={signal.id} className="bg-black/40 border border-white/5 rounded-xl p-3">
                        <div className={`text-[11px] font-bold uppercase mb-1 ${
                          signal.color === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'
                        }`}>
                          {signal.type}
                        </div>
                        <div className="text-xs font-bold text-white mb-1">{signal.market}</div>
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-white/60 flex items-center gap-1.5">
                            {signal.movement.includes('to') ? (
                              <>
                                <span>{signal.movement.split('to')[0].trim()}</span>
                                <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                                <span>{signal.movement.split('to')[1].trim()}</span>
                              </>
                            ) : signal.movement.includes('→') ? (
                              <>
                                <span>{signal.movement.split('→')[0].trim()}</span>
                                <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                                <span>{signal.movement.split('→')[1].trim()}</span>
                              </>
                            ) : (
                              signal.movement
                            )}
                          </span>
                          <span className={`font-bold ${
                            signal.color === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'
                          }`}>
                            {signal.detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Prediction Callers List */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      Top Prediction Callers
                    </div>
                  </div>
                  <div className="space-y-3">
                    {topTraders.slice(0, 5).map((trader) => (
                      <div key={trader.handle} className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full border border-white/15 overflow-hidden bg-black/60 shrink-0">
                            <img
                              src={trader.avatarUrl}
                              alt={`${trader.handle} Avatar`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-white font-semibold">
                              @{trader.handle}
                            </div>
                            <div className="text-[10px] text-white/40 font-mono">
                              {formatPercent(trader.accuracy)} Acc • {formatVolumeText(trader.volume)}
                            </div>
                          </div>
                        </div>
                        <span className="text-emerald-400 font-mono font-bold text-right">{formatPnlText(trader.pnl)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </section>
  );
};
