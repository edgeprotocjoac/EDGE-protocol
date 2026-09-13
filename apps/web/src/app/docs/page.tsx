'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LandingNavbar } from '@/components/organisms/landing/LandingNavbar';
import { LandingFooter } from '@/components/organisms/landing/LandingFooter';

export default function DocsPage() {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const mainnetAddresses = {
    edgeToken: "0x9a6e4fdce052186e942e8267424f1df0ded3ff5a",
    positionManager: "0x9D8b7b2A3a123BFA890c21342f1b490899Cd79eE",
    marketFactory: "0x387D0Ea34b98441a33f92dfb75f7f23Fd1579898",
    conditionalTokens: "0xEBf89888966e48D54825635EDa18946C78407E6e",
    clobExchange: "0x88488C742a8307D9A515f6BC5e01Aa09a1a4e910",
    usdgCollateral: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168"
  };

  const testnetAddresses = {
    positionManager: "0x68a55FedBCd8E3600E012F0ff7E048d37996Bee7",
    marketFactory: "0x5AA5513952EccdEd11CEe927730a550C4bEbf2Bf",
    conditionalTokens: "0xc8b934e98Eb38E77a4950d93CaF88315a3DE2414",
    clobExchange: "0x17f6c84c1d4699aD841Bc6A57F5465e7B8672605",
    usdgCollateral: "0xF47593cac046C3a4C15B495eDAd59DE5868B6BbB"
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col font-sans">
      <LandingNavbar />
      
      <div className="flex-1 flex container max-w-7xl mx-auto px-6 pt-10 pb-20 mt-20">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 hidden lg:block pr-8 border-r border-white/5">
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Introduction</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#overview" className="text-white/70 hover:text-white transition-colors block py-1">Overview & Mission</a></li>
                <li><a href="#robinhood-chain" className="text-white/70 hover:text-white transition-colors block py-1">Robinhood Chain</a></li>
                <li><a href="#key-innovations" className="text-white/70 hover:text-white transition-colors block py-1">Key Innovations</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Social Layer</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#verified-callouts" className="text-white/70 hover:text-white transition-colors block py-1">Verified Callouts</a></li>
                <li><a href="#conviction-score" className="text-white/70 hover:text-white transition-colors block py-1">Conviction Engine</a></li>
                <li><a href="#copy-trading" className="text-white/70 hover:text-white transition-colors block py-1">1-Tap Copy Trading</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Smart Contracts</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#architecture" className="text-white/70 hover:text-white transition-colors block py-1">System Architecture</a></li>
                <li><a href="#conditional-tokens" className="text-white/70 hover:text-white transition-colors block py-1">Conditional Tokens</a></li>
                <li><a href="#position-manager" className="text-white/70 hover:text-white transition-colors block py-1">Position Manager</a></li>
                <li><a href="#market-factory" className="text-white/70 hover:text-white transition-colors block py-1">Market Factory</a></li>
                <li><a href="#oracles" className="text-white/70 hover:text-white transition-colors block py-1">Oracles & Settlement</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Trading & Math</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#clob-orderbook" className="text-white/70 hover:text-white transition-colors block py-1">CLOB Matching Engine</a></li>
                <li><a href="#probability-pricing" className="text-white/70 hover:text-white transition-colors block py-1">Probability Pricing Math</a></li>
                <li><a href="#fees-yields" className="text-white/70 hover:text-white transition-colors block py-1">Fees & Collateral Yield</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Developer & Deployment</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#contract-addresses" className="text-white/70 hover:text-white transition-colors block py-1">Contract Addresses</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-10 max-w-4xl min-w-0">
          
          {/* Header Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono text-white mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>EDGE PROTOCOL TECHNICAL DOCS v1.2</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
            EDGE Protocol Documentation Hub
          </h1>
          
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            EDGE Protocol is the premier social prediction market built natively on the Robinhood Chain. By bridging on-chain smart contract execution with real-time social trade callouts, EDGE allows traders to verify predictions, track historical PnL, and copy trades with 1-tap simplicity.
          </p>

          {/* Top Mainnet Contract Address Bar */}
          <div className="bg-[#121215] border border-white/10 rounded-xl p-4 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Official EDGE Protocol Token Address (CA)</div>
              <div className="font-mono text-xs sm:text-sm text-white font-semibold break-all select-all">
                {mainnetAddresses.edgeToken}
              </div>
            </div>
            <button
              onClick={() => handleCopy(mainnetAddresses.edgeToken, 'hero-ca')}
              className="px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg text-xs font-mono font-bold transition-all shrink-0 active:scale-95"
            >
              {copiedMap['hero-ca'] ? "COPIED!" : "COPY ADDRESS"}
            </button>
          </div>

          <hr className="border-white/5 mb-12" />

          {/* ========================================================================= */}
          {/* SECTION 1: OVERVIEW & ROBINHOOD CHAIN */}
          {/* ========================================================================= */}
          
          <section id="overview" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">1. Protocol Overview & Mission</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Prediction markets have traditionally suffered from two key issues: fragmented liquidity and the noise of unverified social media hype. EDGE Protocol solves both by unifying a high-throughput Central Limit Order Book (CLOB) with a transparent social verification protocol.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="font-mono text-white/40">01</span> Zero Counterparty Risk
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  All binary outcome positions are fully collateralized 1:1 in USDG smart contracts. Winners are guaranteed instant 1.00 USDG payouts upon Oracle resolution.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="font-mono text-white/40">02</span> On-Chain Social Verification
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Every prediction post ("Callout") requires an active on-chain position. Influencers and analysts can no longer post fake screenshots without real capital commitment.
                </p>
              </div>
            </div>
          </section>

          <section id="robinhood-chain" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">2. Robinhood Chain Infrastructure</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              EDGE Protocol is built natively on the Robinhood Chain to achieve sub-second order matching, zero-latency feed updates, and negligible transaction fees.
            </p>

            <div className="bg-[#0b0b0e] border border-white/10 rounded-xl p-6 mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">Infrastructure Performance Specs</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                  <div className="text-2xl font-mono font-bold text-white mb-1">&lt; 100ms</div>
                  <div className="text-xs text-white/50">Block Finality</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                  <div className="text-2xl font-mono font-bold text-white mb-1">$0.0001</div>
                  <div className="text-xs text-white/50">Avg Gas Fee</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                  <div className="text-2xl font-mono font-bold text-white mb-1">USDG</div>
                  <div className="text-xs text-white/50">Native Collateral</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                  <div className="text-2xl font-mono font-bold text-white mb-1">100%</div>
                  <div className="text-xs text-white/50">Non-Custodial</div>
                </div>
              </div>
            </div>
          </section>

          <section id="key-innovations" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">3. Key Innovations</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              By combining decentralized finance (DeFi) primitives with modern social feed interactions, EDGE creates a self-correcting information marketplace:
            </p>

            {/* Comparison Card: Traditional vs EDGE */}
            <div className="bg-[#121215] border border-white/10 rounded-xl p-6 mb-8">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6">Verification Layer Comparison</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Traditional */}
                <div className="p-5 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-wider">Traditional Social Platforms</span>
                    <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">Unverified</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/50">
                    <li className="flex items-start gap-2">
                      <span className="text-white/30 font-mono">•</span>
                      <span>Fake PnL screenshots & edited trade results.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/30 font-mono">•</span>
                      <span>Zero capital commitment or skin in the game.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/30 font-mono">•</span>
                      <span>Followers misled by unbacked hype posts.</span>
                    </li>
                  </ul>
                </div>

                {/* EDGE Protocol */}
                <div className="p-5 rounded-xl bg-black border border-white/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">EDGE Protocol On-Chain Feed</span>
                    <span className="text-[10px] font-mono bg-white text-black font-bold px-2 py-0.5 rounded">100% Cryptographic Proof</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/80">
                    <li className="flex items-start gap-2">
                      <span className="text-white font-mono">•</span>
                      <span>On-chain position proof linked to every callout post.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white font-mono">•</span>
                      <span>USDG collateral locked directly in smart contracts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white font-mono">•</span>
                      <span>1-Tap copy trading directly from verified feed posts.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3 Core Innovation Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">PILLAR 01</div>
                <h4 className="text-sm font-bold text-white mb-2">Skin in the Game</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Callouts require an active on-chain position, ensuring analysts back their claims with real capital.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">PILLAR 02</div>
                <h4 className="text-sm font-bold text-white mb-2">Public Trading Journal</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Win rates, total PnL, and conviction scores are calculated on-chain from verified contract events.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">PILLAR 03</div>
                <h4 className="text-sm font-bold text-white mb-2">Unified USDG Vault</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Trade predictions across Equities, Crypto, Rates, and Macro using a single unified USDG collateral balance.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-white/5 mb-16" />

          {/* ========================================================================= */}
          {/* SECTION 2: SOCIAL LAYER & VERIFIED CALLOUTS */}
          {/* ========================================================================= */}

          <section id="verified-callouts" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">4. Verified Callouts Engine</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              A <strong className="text-white font-semibold">Callout</strong> is a social prediction post attached to an active on-chain conditional token trade. When a trader submits a callout, the transaction hash is cryptographically linked to their post.
            </p>

            <div className="bg-[#121215] border border-white/10 rounded-xl p-6 mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6">Callout Lifecycle Flow</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-black/60 border border-white/10 p-4 rounded-xl relative">
                  <div className="text-xs font-mono text-white/40 mb-2">STEP 01</div>
                  <div className="text-sm font-bold text-white mb-1">Trader Initiates Callout</div>
                  <div className="text-xs text-white/60 leading-relaxed">Trader creates prediction post with commentary and selects YES/NO stance.</div>
                </div>

                <div className="bg-black/60 border border-white/10 p-4 rounded-xl relative">
                  <div className="text-xs font-mono text-white/40 mb-2">STEP 02</div>
                  <div className="text-sm font-bold text-white mb-1">PositionManager.sol</div>
                  <div className="text-xs text-white/60 leading-relaxed">Smart contract locks USDG collateral and mints outcome tokens on-chain.</div>
                </div>

                <div className="bg-black/60 border border-white/10 p-4 rounded-xl relative">
                  <div className="text-xs font-mono text-white/40 mb-2">STEP 03</div>
                  <div className="text-sm font-bold text-white mb-1">On-Chain Event Emitted</div>
                  <div className="text-xs text-white/60 leading-relaxed"><code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded text-[11px]">CalloutCreated(id, tx)</code> event is published to Robinhood Chain.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/60 border border-white/10 p-4 rounded-xl relative">
                  <div className="text-xs font-mono text-white/40 mb-2">STEP 04</div>
                  <div className="text-sm font-bold text-white mb-1">Indexer Links Position</div>
                  <div className="text-xs text-white/60 leading-relaxed">Subgraph indexer verifies position proof & attaches live PnL to public journal.</div>
                </div>

                <div className="bg-black/60 border border-white/10 p-4 rounded-xl relative">
                  <div className="text-xs font-mono text-white/40 mb-2">STEP 05</div>
                  <div className="text-sm font-bold text-white mb-1">Social Feed Broadcast</div>
                  <div className="text-xs text-white/60 leading-relaxed">Callout appears on public feed with verified badge and conviction score.</div>
                </div>

                <div className="bg-black/60 border border-white/10 p-4 rounded-xl relative">
                  <div className="text-xs font-mono text-white/40 mb-2">STEP 06</div>
                  <div className="text-sm font-bold text-white mb-1">1-Tap Copy Trade</div>
                  <div className="text-xs text-white/60 leading-relaxed">Followers execute identical position instantly with 1 tap directly in-feed.</div>
                </div>
              </div>
            </div>
          </section>

          <section id="conviction-score" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">5. Conviction Score Algorithm</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              To rank callouts in the social discovery feed, EDGE computes a dynamic <strong className="text-white font-semibold">Conviction Score</strong> (<span className="font-mono text-white">C</span>) based on position size, trader historical win rate, and time decay:
            </p>

            <div className="bg-[#121215] border border-white/10 rounded-xl p-6 mb-6">
              <div className="font-mono text-sm text-white bg-black/40 p-4 rounded-lg border border-white/5 mb-4 text-center">
                {"C = log10(Position Size in USDG) × (Historical Win Rate %) × e^(-λt)"}
              </div>
              <ul className="text-xs text-white/60 space-y-2 list-disc list-inside">
                <li><strong className="text-white">Position Size:</strong> Logarithmic scaling rewards skin-in-the-game while mitigating whale skew.</li>
                <li><strong className="text-white">Win Rate:</strong> Verified historical win rate over the last 50 resolved callouts.</li>
                <li><strong className="text-white">Time Decay (e^-λt):</strong> Ensures fresh market updates rank higher than stale trades.</li>
              </ul>
            </div>
          </section>

          <section id="copy-trading" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">6. 1-Tap Copy Trading</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              When viewing a callout in the feed, users can copy the exact market stance with a single click. The protocol automatically routes the order to the CLOB order book with customizable slippage limits.
            </p>
          </section>

          <hr className="border-white/5 mb-16" />

          {/* ========================================================================= */}
          {/* SECTION 3: SMART CONTRACTS */}
          {/* ========================================================================= */}

          <section id="architecture" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">7. Smart Contract Architecture</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              The smart contract stack consists of three core components: `ConditionalTokens.sol` (ERC-1155), `PositionManager.sol`, and `MarketFactory.sol`.
            </p>

            {/* Architecture SVG Diagram */}
            <div className="bg-[#121215] border border-white/10 rounded-xl p-6 mb-6 overflow-x-auto">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">Contract Flowchart</h4>
              <div className="min-w-[600px] flex items-center justify-between gap-4 font-mono text-xs">
                <div className="bg-black/60 border border-white/10 p-4 rounded-lg text-center flex-1">
                  <div className="text-white font-bold mb-1">User Vault</div>
                  <div className="text-white/50 text-[10px]">USDG Balance</div>
                </div>
                <div className="text-white/40">--&gt;</div>
                <div className="bg-black/60 border border-white/20 p-4 rounded-lg text-center flex-1">
                  <div className="text-white font-bold mb-1">PositionManager</div>
                  <div className="text-white/50 text-[10px]">Mint / Burn ERC-1155</div>
                </div>
                <div className="text-white/40">--&gt;</div>
                <div className="bg-black/60 border border-white/10 p-4 rounded-lg text-center flex-1">
                  <div className="text-white font-bold mb-1">ConditionalTokens</div>
                  <div className="text-white/50 text-[10px]">YES / NO Outcome Tokens</div>
                </div>
                <div className="text-white/40">--&gt;</div>
                <div className="bg-black/60 border border-white/20 p-4 rounded-lg text-center flex-1">
                  <div className="text-white font-bold mb-1">Oracle Resolution</div>
                  <div className="text-white/50 text-[10px]">Pushes Result</div>
                </div>
              </div>
            </div>
          </section>

          <section id="conditional-tokens" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">8. IConditionalTokens.sol</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Implements ERC-1155 multi-tokens representing outcome slots for binary predictions.
            </p>
            <div className="bg-black/80 border border-white/10 rounded-xl p-5 overflow-x-auto mb-6">
              <pre className="text-xs text-white/80 font-mono leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IConditionalTokens {
    event ConditionPreparation(
        bytes32 indexed conditionId, 
        address indexed oracle, 
        bytes32 indexed questionId, 
        uint outcomeSlotCount
    );

    function prepareCondition(
        address oracle, 
        bytes32 questionId, 
        uint outcomeSlotCount
    ) external;

    function splitPosition(
        address collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint[] calldata partition,
        uint amount
    ) external;

    function mergePositions(
        address collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint[] calldata partition,
        uint amount
    ) external;

    function reportPayouts(
        bytes32 questionId, 
        uint[] calldata payouts
    ) external;
}`}
              </pre>
            </div>
          </section>

          <section id="position-manager" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">9. IPositionManager.sol</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Handles user order deposits, leverage management, and single-click execution.
            </p>
            <div className="bg-black/80 border border-white/10 rounded-xl p-5 overflow-x-auto mb-6">
              <pre className="text-xs text-white/80 font-mono leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPositionManager {
    function executeOrder(
        bytes32 marketId,
        uint8 outcomeIndex, // 0 = YES, 1 = NO
        uint256 amountUSDG,
        uint256 maxSlippageBps
    ) external returns (uint256 sharesMinted);

    function createCallout(
        bytes32 marketId,
        uint8 outcomeIndex,
        uint256 amountUSDG,
        string calldata commentaryURI
    ) external returns (bytes32 calloutId);
}`}
              </pre>
            </div>
          </section>

          <section id="market-factory" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">10. IMarketFactory.sol</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Factory contract deployed on Robinhood Chain for creating new prediction markets across categories.
            </p>
            <div className="bg-black/80 border border-white/10 rounded-xl p-5 overflow-x-auto mb-6">
              <pre className="text-xs text-white/80 font-mono leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMarketFactory {
    function createMarket(
        string calldata title,
        string calldata category, // Equities, Crypto, Rates, Macro
        uint256 resolutionTimestamp,
        address oracleAddress,
        bytes32 questionId
    ) external returns (address marketAddress);
}`}
              </pre>
            </div>
          </section>

          <section id="oracles" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">11. Oracles & Settlement</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Markets resolve via optimistic reporting. If no dispute is raised within the 2-hour challenge window, the proposed payout vector `[1, 0]` (YES wins) or `[0, 1]` (NO wins) becomes final.
            </p>
          </section>

          <hr className="border-white/5 mb-16" />

          {/* ========================================================================= */}
          {/* SECTION 4: TRADING & MATH */}
          {/* ========================================================================= */}

          <section id="clob-orderbook" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">12. CLOB Matching Engine</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              EDGE utilizes an off-chain orderbook with on-chain batch settlement. Limit orders are matched in price-time priority.
            </p>
          </section>

          <section id="probability-pricing" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">13. Implied Probability & Pricing Math</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              In a binary market, share prices directly reflect the market's estimated probability of outcome occurrence:
            </p>

            <div className="bg-[#121215] border border-white/10 rounded-xl p-6 mb-6">
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-black/60 rounded-lg border border-white/10 text-white/80">
                  <div className="text-white font-bold mb-2 uppercase tracking-wider text-[11px]">Example Calculation:</div>
                  <div className="space-y-1">
                    <div>Limit Price (YES Share) = <span className="text-white font-bold">$0.42 USDG</span></div>
                    <div>Implied Market Probability = <span className="text-white font-bold">42%</span></div>
                    <div>Purchase Cost for 1,000 Shares = <span className="text-white font-bold">$420.00 USDG</span></div>
                    <div>Max Payout if YES Resolves = <span className="text-white font-bold">$1,000.00 USDG</span></div>
                    <div>Net Profit = <span className="text-white font-bold">$580.00 USDG (+138% Return)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="fees-yields" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">14. Protocol Fees & Yields</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              EDGE Protocol charges 0% maker fees and a minimal 0.15% taker fee. Idle collateral in market vaults earns native yield through Robinhood Chain USDG treasury integration.
            </p>
          </section>

          <hr className="border-white/5 mb-16" />

          {/* ========================================================================= */}
          {/* SECTION 5: DEVELOPER & DEPLOYMENT */}
          {/* ========================================================================= */}

          <section id="contract-addresses" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">15. Verified Contract Addresses</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              All EDGE Protocol smart contracts are verified on the Robinhood Chain Block Explorer for both Mainnet and Testnet environments.
            </p>

            {/* Dual Grid: Mainnet & Testnet */}
            <div className="space-y-8">
              
              {/* MAINNET ADDRESSES */}
              <div className="bg-[#121215] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Robinhood Mainnet Contracts (Chain ID: 4663)</h3>
                </div>

                <div className="space-y-3">
                  {/* EDGE Token CA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">EDGE Protocol Token (CA)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{mainnetAddresses.edgeToken}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(mainnetAddresses.edgeToken, 'mn-ca')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['mn-ca'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* PositionManager */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">EDGE PositionManager (Core)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{mainnetAddresses.positionManager}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(mainnetAddresses.positionManager, 'mn-pm')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['mn-pm'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* MarketFactory */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">MarketFactory</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{mainnetAddresses.marketFactory}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(mainnetAddresses.marketFactory, 'mn-mf')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['mn-mf'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* ConditionalTokens */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">ConditionalTokens (ERC-1155)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{mainnetAddresses.conditionalTokens}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(mainnetAddresses.conditionalTokens, 'mn-ct')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['mn-ct'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* CLOB Exchange */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">CLOB Orderbook Exchange</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{mainnetAddresses.clobExchange}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(mainnetAddresses.clobExchange, 'mn-ex')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['mn-ex'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* USDG Collateral */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">USDG Stablecoin Vault</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{mainnetAddresses.usdgCollateral}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(mainnetAddresses.usdgCollateral, 'mn-usdg')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white text-black hover:bg-white/90 rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['mn-usdg'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>
                </div>
              </div>

              {/* TESTNET ADDRESSES */}
              <div className="bg-[#121215] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full border border-white/60 bg-white/20"></span>
                  <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">Robinhood Testnet Contracts (Chain ID: 46630)</h3>
                </div>

                <div className="space-y-3">
                  {/* PositionManager Testnet */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">EDGE PositionManager (Testnet)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{testnetAddresses.positionManager}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(testnetAddresses.positionManager, 'tn-pm')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['tn-pm'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* MarketFactory Testnet */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">MarketFactory (Testnet)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{testnetAddresses.marketFactory}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(testnetAddresses.marketFactory, 'tn-mf')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['tn-mf'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* ConditionalTokens Testnet */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">ConditionalTokens (ERC-1155 Testnet)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{testnetAddresses.conditionalTokens}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(testnetAddresses.conditionalTokens, 'tn-ct')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['tn-ct'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* CLOB Exchange Testnet */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">CLOB Orderbook Exchange (Testnet)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{testnetAddresses.clobExchange}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(testnetAddresses.clobExchange, 'tn-ex')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['tn-ex'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>

                  {/* USDG Collateral Testnet */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/60 rounded-lg border border-white/5">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white mb-0.5">USDG Stablecoin Vault (Testnet)</div>
                      <div className="font-mono text-xs text-white/70 break-all select-all">{testnetAddresses.usdgCollateral}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(testnetAddresses.usdgCollateral, 'tn-usdg')}
                      className="text-xs font-mono font-bold px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded shrink-0 self-start sm:self-center transition-all active:scale-95"
                    >
                      {copiedMap['tn-usdg'] ? "COPIED!" : "COPY"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>

      <LandingFooter />
    </div>
  );
}


