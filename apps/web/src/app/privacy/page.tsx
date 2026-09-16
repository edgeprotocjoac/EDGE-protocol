'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LandingNavbar } from '@/components/organisms/landing/LandingNavbar';
import { LandingFooter } from '@/components/organisms/landing/LandingFooter';

export default function UnifiedLegalPage() {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'privacy' | 'terms'>('all');
  const [activeSection, setActiveSection] = useState<string>('privacy-overview');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          scrollTo(hash);
        }, 300);
      }
    }
  }, []);

  const privacySections = [
    { id: 'privacy-overview', title: '1. Overview & Architecture' },
    { id: 'privacy-data-collected', title: '2. Information We Collect' },
    { id: 'privacy-data-never-collected', title: '3. Data Never Collected' },
    { id: 'privacy-data-usage', title: '4. How Information is Used' },
    { id: 'privacy-third-parties', title: '5. Infrastructure Partners' },
    { id: 'privacy-blockchain-immutability', title: '6. Blockchain Immutability' },
    { id: 'privacy-security', title: '7. Security & Encryption' },
    { id: 'privacy-user-rights', title: '8. User Privacy Rights' },
    { id: 'privacy-age-policy', title: '9. Age Limitation Policy' },
  ];

  const termsSections = [
    { id: 'terms-acceptance', title: '10. Acceptance of Terms' },
    { id: 'terms-protocol-nature', title: '11. Non-Custodial Protocol' },
    { id: 'terms-risk-disclosure', title: '12. Financial Risk Disclosure' },
    { id: 'terms-no-financial-advice', title: '13. No Financial Advice' },
    { id: 'terms-oracle-resolution', title: '14. Oracle Resolution Criteria' },
    { id: 'terms-perps-liquidation', title: '15. Perps & Liquidations' },
    { id: 'terms-restricted-jurisdictions', title: '16. Restricted Jurisdictions' },
    { id: 'terms-prohibited-conduct', title: '17. Prohibited Conduct' },
    { id: 'terms-limitation-liability', title: '18. Limitation of Liability' },
    { id: 'terms-disclaimer', title: '19. Amendments & Inquiries' },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col font-sans selection:bg-white/20">
      <LandingNavbar />

      {/* Mobile Horizontal Navigation Chips */}
      <div className="lg:hidden sticky top-16 z-20 bg-[#070709]/95 backdrop-blur border-b border-white/10 px-4 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
        <button
          onClick={() => { setActiveTab('all'); scrollTo('legal-top'); }}
          className={`text-xs font-mono px-3 py-1.5 rounded-lg shrink-0 transition-all ${
            activeTab === 'all' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          All Sections
        </button>
        <button
          onClick={() => { setActiveTab('privacy'); scrollTo('privacy-policy-header'); }}
          className={`text-xs font-mono px-3 py-1.5 rounded-lg shrink-0 transition-all ${
            activeTab === 'privacy' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => { setActiveTab('terms'); scrollTo('terms-of-service-header'); }}
          className={`text-xs font-mono px-3 py-1.5 rounded-lg shrink-0 transition-all ${
            activeTab === 'terms' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => scrollTo('legal-contact')}
          className="text-xs font-mono px-3 py-1.5 rounded-lg shrink-0 bg-white/5 text-white/60 hover:text-white transition-all"
        >
          Contact
        </button>
      </div>

      <div id="legal-top" className="flex-1 flex container max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20 mt-14 sm:mt-20">
        
        {/* Desktop Sticky Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 hidden lg:block pr-8 border-r border-white/5">
          <div className="sticky top-28 space-y-7">
            
            {/* Document Switcher / Filter */}
            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Navigation Scope</h3>
              <div className="grid grid-cols-3 gap-1 bg-[#121215] p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`text-[11px] font-mono py-1 rounded transition-all ${
                    activeTab === 'all' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`text-[11px] font-mono py-1 rounded transition-all ${
                    activeTab === 'privacy' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Privacy
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`text-[11px] font-mono py-1 rounded transition-all ${
                    activeTab === 'terms' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Terms
                </button>
              </div>
            </div>

            {/* Privacy Policy Nav */}
            {(activeTab === 'all' || activeTab === 'privacy') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Privacy Policy</h3>
                  <span className="text-[10px] font-mono text-white/30">01-09</span>
                </div>
                <ul className="space-y-1 text-xs">
                  {privacySections.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollTo(item.id)}
                        className={`text-left w-full py-1 px-2 rounded transition-colors block ${
                          activeSection === item.id
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Terms of Service Nav */}
            {(activeTab === 'all' || activeTab === 'terms') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Terms of Service</h3>
                  <span className="text-[10px] font-mono text-white/30">10-19</span>
                </div>
                <ul className="space-y-1 text-xs">
                  {termsSections.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollTo(item.id)}
                        className={`text-left w-full py-1 px-2 rounded transition-colors block ${
                          activeSection === item.id
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Support Link */}
            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Inquiries & Audits</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => scrollTo('legal-contact')}
                    className="text-left w-full py-1 px-2 rounded text-white/60 hover:text-white transition-colors block"
                  >
                    Compliance Contact
                  </button>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="py-1 px-2 rounded text-white/60 hover:text-white transition-colors block"
                  >
                    Technical Docs
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-10 max-w-4xl min-w-0">
          
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono text-white mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>EDGE PROTOCOL LEGAL & COMPLIANCE HUB v1.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight text-white">
            Privacy Policy & Terms of Service
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8">
            This unified document outlines the complete data handling principles, cryptographic non-custodial disclosures, financial risk disclosures, and terms of engagement governing all interactions with the EDGE Protocol smart contracts and user interfaces on Robinhood Chain.
          </p>

          {/* Metadata & Quick Action Banner */}
          <div className="bg-[#121215] border border-white/10 rounded-xl p-4 sm:p-5 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                Official Compliance & Legal Inquiries
              </div>
              <div className="font-mono text-xs sm:text-sm text-white font-semibold break-all select-all">
                legal@edgeprotocol.tech
              </div>
              <div className="text-[11px] font-mono text-white/40">
                Effective Date: September 16, 2026 | Governing Ledger: Robinhood Chain
              </div>
            </div>
            <button
              onClick={() => handleCopy('legal@edgeprotocol.tech', 'legal-email')}
              className="px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg text-xs font-mono font-bold transition-all shrink-0 active:scale-95"
            >
              {copiedMap['legal-email'] ? 'COPIED!' : 'COPY EMAIL'}
            </button>
          </div>

          {/* Quick Jump Buttons for Mobile / Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <button
              onClick={() => scrollTo('privacy-policy-header')}
              className="p-4 rounded-xl bg-[#121215] border border-white/10 hover:border-white/30 text-left transition-all group"
            >
              <div className="text-xs font-mono text-white/40 mb-1">PART 01</div>
              <div className="text-base font-bold text-white group-hover:text-white flex items-center justify-between">
                <span>Privacy Policy</span>
                <span className="text-xs font-mono text-white/40">9 Sections &rarr;</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Data protection, cryptographic non-custody, and blockchain immutability.</p>
            </button>

            <button
              onClick={() => scrollTo('terms-of-service-header')}
              className="p-4 rounded-xl bg-[#121215] border border-white/10 hover:border-white/30 text-left transition-all group"
            >
              <div className="text-xs font-mono text-white/40 mb-1">PART 02</div>
              <div className="text-base font-bold text-white group-hover:text-white flex items-center justify-between">
                <span>Terms of Service</span>
                <span className="text-xs font-mono text-white/40">10 Sections &rarr;</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Trading agreements, leverage risk, liquidation parameters, and sanctions.</p>
            </button>
          </div>

          <hr className="border-white/5 mb-14" />

          {/* ========================================================================= */}
          {/* PART 1: PRIVACY POLICY */}
          {/* ========================================================================= */}

          <div id="privacy-policy-header" className="scroll-mt-28 mb-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs font-bold uppercase mb-3">
              Part 1
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Privacy Policy
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Transparent specifications regarding data collection, client privacy safeguards, and decentralized storage mechanics.
            </p>
          </div>

          {/* Section 1 */}
          <section id="privacy-overview" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">1. Overview & Non-Custodial Architecture</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Welcome to <strong>EDGE Protocol</strong> (incorporating the <strong>EDGE FOMO</strong> verified social trading infrastructure). EDGE Protocol is a decentralized prediction market and perpetual derivatives network operating natively on the <strong>Robinhood Chain</strong>, denominated and settled in <strong>USDG</strong> collateral tokens.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="font-mono text-white/40">01</span> Zero Key Custody
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  The protocol is completely non-custodial. We never hold, access, or manage your private keys, seed phrases, or cryptographic assets. All actions require your personal authorization.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="font-mono text-white/40">02</span> Autonomous Smart Contracts
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Collateral locks, conditional token minting, and binary outcome payouts execute deterministically through immutable smart contracts deployed directly to the distributed ledger.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="privacy-data-collected" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">2. Information We Collect</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              In order to provide graphical user interfaces, social trading discovery, and low-latency orderbook routing, EDGE Protocol processes limited categories of information:
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm sm:text-base">A. Public Distributed Ledger Data (On-Chain)</h4>
                  <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">Public Record</span>
                </div>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  When connecting your Web3 wallet, your public blockchain address (0x...), native token balances, USDG collateral deposits, conditional outcome share holdings (YES/NO tokens), limit orders, and on-chain perpetual positions are recorded directly onto the public Robinhood Chain distributed ledger.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm sm:text-base">B. Social Trader Profile & Feed Data (Off-Chain)</h4>
                  <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">User Provided</span>
                </div>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  Information you voluntarily associate with your trader profile—such as Display Name, Handle (@username), Bio, Avatar URL, connected X (Twitter) profile reference, public Callout market theses, comments, and engagement metrics—is stored in our isolated database to power social discovery feeds and leaderboard rankings.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm sm:text-base">C. Account Authentication & Security Secrets</h4>
                  <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">Encrypted</span>
                </div>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  If you authenticate via email login or enable Two-Factor Authentication (2FA), your registered email address and cryptographic TOTP secrets are stored in encrypted form. In-app generated wallets store encrypted key material derived with client-side salt and passcode hashing.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm sm:text-base">D. Minimal Technical Diagnostics & Defense Logs</h4>
                  <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">Transient</span>
                </div>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  We collect minimal server request data (temporary IP address hashes, user-agent headers, and error logs) strictly to enforce API rate limiting, defend against distributed denial-of-service (DDoS) attempts, and prevent automated sybil bot manipulation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="privacy-data-never-collected" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">3. Data We Never Collect or Store</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              In strict adherence to decentralized and non-custodial principles, EDGE Protocol explicitly maintains an anti-surveillance baseline:
            </p>

            <div className="bg-[#0b0b0e] border border-white/10 rounded-xl p-5 sm:p-6 mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">Zero-Collection Guarantees</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-white/40 font-bold shrink-0">[x]</span>
                  <span><strong>No Private Keys or Recovery Phrases:</strong> We cannot access, view, or restore your personal wallet recovery seeds or unencrypted private keys.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-white/40 font-bold shrink-0">[x]</span>
                  <span><strong>No Traditional Identity Documents (Non-KYC):</strong> We do not request government passports, driver licenses, national ID cards, or biometric facial scans to interact with decentralized smart contracts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-white/40 font-bold shrink-0">[x]</span>
                  <span><strong>No Banking or Credit Card Data:</strong> The protocol operates entirely on digital cryptographic collateral ($USDG) and never handles traditional fiat bank routing numbers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-white/40 font-bold shrink-0">[x]</span>
                  <span><strong>No Third-Party Data Monetization:</strong> We do not sell, monetize, or license user profile metrics to advertisers, tracking bureaus, or external data brokers.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="privacy-data-usage" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">4. How Information is Utilized</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Every data element processed by the protocol serves a direct and necessary functional purpose:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="text-xs font-mono text-white/40 mb-2">PURPOSE 01</div>
                <h4 className="text-sm font-bold text-white mb-2">Orderbook & Matching Service</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Facilitating gas-optimized off-chain EIP-712 order matching before submitting atomic batch settlement transactions to the Robinhood Chain contracts.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="text-xs font-mono text-white/40 mb-2">PURPOSE 02</div>
                <h4 className="text-sm font-bold text-white mb-2">Trader Reputation & Win Rates</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Aggregating verified on-chain trade outcomes to compute historical win rates, Conviction Scores, and transparent leaderboard standings.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="text-xs font-mono text-white/40 mb-2">PURPOSE 03</div>
                <h4 className="text-sm font-bold text-white mb-2">Position Alerts & Risk Warnings</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Dispatching real-time notifications when your perpetual positions approach maintenance margin requirements or liquidation price boundaries.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <div className="text-xs font-mono text-white/40 mb-2">PURPOSE 04</div>
                <h4 className="text-sm font-bold text-white mb-2">Anti-Sybil & Defense Infrastructure</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Enforcing API rate limits and preventing automated wash-trading scripts from manipulating market probability spreads or social feed feeds.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="privacy-third-parties" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">5. Infrastructure & Service Providers</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              We coordinate with reputable, high-availability technical providers to maintain uninterrupted platform availability:
            </p>

            <div className="bg-[#121215] border border-white/10 rounded-xl p-5 sm:p-6 mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <div className="font-bold text-white text-sm">Supabase Infrastructure</div>
                  <div className="text-xs text-white/60 mt-1">Managed PostgreSQL database clusters and authentication services compliant with SOC 2 Type II standards.</div>
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50 shrink-0 self-start">Database</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <div className="font-bold text-white text-sm">Dedicated Blockchain RPC Nodes</div>
                  <div className="text-xs text-white/60 mt-1">Direct node proxy infrastructure routing read/write transactions securely to the Robinhood Chain network.</div>
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50 shrink-0 self-start">RPC Proxy</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white text-sm">External Oracle Data Feeds</div>
                  <div className="text-xs text-white/60 mt-1">Public meteorological readings (Open-Meteo, NOAA/NWS) and aggregated benchmark crypto price feeds utilized for contract outcome evaluation.</div>
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50 shrink-0 self-start">Oracle Feeds</span>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="privacy-blockchain-immutability" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">6. Blockchain Immutability Notice</h3>
            <div className="bg-[#121215] border border-white/15 rounded-xl p-5 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold bg-white text-black px-2 py-0.5 rounded">ARCHITECTURAL NOTICE</span>
                <span className="text-xs text-white/50 font-mono">Irreversible Ledger Execution</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                All transactions broadcast to the Robinhood Chain—including order fills, collateral locks, share purchases, and wallet transfers—are <strong>permanent, publicly verifiable, and mathematically immutable</strong>.
              </p>
              <p className="text-xs text-white/60 leading-relaxed">
                Neither the developers of EDGE Protocol nor any third-party infrastructure maintain administrative master keys or technical ability to edit, delete, or reverse transaction data etched into confirmed blockchain blocks.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="privacy-security" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">7. Security & Cryptographic Encryption</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              We implement comprehensive defense-in-depth technical measures to safeguard protocol data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">DEFENSE 01</div>
                <h4 className="text-sm font-bold text-white mb-2">Transport Layer Encryption</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Enforced TLS 1.3 encryption across all client-to-server and server-to-node network communications.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">DEFENSE 02</div>
                <h4 className="text-sm font-bold text-white mb-2">PBKDF2 & AES-GCM Vaults</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  In-app wallet key material is encrypted using salted PBKDF2 key derivation and AES-GCM symmetric ciphers.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">DEFENSE 03</div>
                <h4 className="text-sm font-bold text-white mb-2">Row-Level Security (RLS)</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Strict database isolation policies ensure user records are only readable or mutable by authenticated owners.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">DEFENSE 04</div>
                <h4 className="text-sm font-bold text-white mb-2">Multi-Factor TOTP Protection</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Standardized RFC 6238 time-based one-time password (TOTP) two-factor authentication with encrypted secrets.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="privacy-user-rights" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">8. User Privacy Rights (GDPR & CCPA)</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Subject to applicable local regulations, users hold definitive rights regarding off-chain database information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <h4 className="text-sm font-bold text-white mb-2">Right to Access</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Request an export of all off-chain profile attributes, comments, and trade histories tied to your account.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <h4 className="text-sm font-bold text-white mb-2">Right to Rectify</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Update, amend, or alter your display username, bio, avatar, and linked social media profiles at any time.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <h4 className="text-sm font-bold text-white mb-2">Right to Erasure</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Request deletion of your off-chain database records and profile associations via compliance channels.
                </p>
              </div>
            </div>
            <p className="text-xs text-white/40 font-mono">
              *Notice: Data erasure requests cannot alter or erase immutable transaction records confirmed on the blockchain ledger.
            </p>
          </section>

          {/* Section 9 */}
          <section id="privacy-age-policy" className="mb-16 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">9. Age Limitation & Minor Protection</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              EDGE Protocol is intended strictly for individuals who are at least 18 years of age (or the legal age of majority in your jurisdiction). We do not intentionally solicit or process data belonging to minors.
            </p>
            <p className="text-white/70 leading-relaxed">
              If an account is determined to belong to an underage user, the associated off-chain profile data will be permanently purged immediately.
            </p>
          </section>

          <hr className="border-white/10 mb-16" />

          {/* ========================================================================= */}
          {/* PART 2: TERMS OF SERVICE */}
          {/* ========================================================================= */}

          <div id="terms-of-service-header" className="scroll-mt-28 mb-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs font-bold uppercase mb-3">
              Part 2
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Terms of Service
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Binding agreements, financial risk disclosures, oracle resolution mechanics, and rules of engagement for all protocol participants.
            </p>
          </div>

          {/* Section 10 */}
          <section id="terms-acceptance" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">10. Acceptance of Terms & Protocol Access</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              By accessing the web interface, utilizing our mobile client, connecting a Web3 wallet, or submitting transactions to the <strong>EDGE Protocol</strong> smart contracts on the Robinhood Chain, you confirm that you have read, comprehended, and agreed to be legally bound by these Terms in their entirety.
            </p>
            <p className="text-white/70 leading-relaxed">
              If you do not accept every clause outlined herein, you must cease using our software interfaces and disconnect your digital wallet immediately.
            </p>
          </section>

          {/* Section 11 */}
          <section id="terms-protocol-nature" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">11. Non-Custodial Protocol Nature</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              EDGE Protocol provides user-friendly software interfaces to interact with decentralized, permissionless smart contract contracts deployed on the Robinhood Chain:
            </p>

            <div className="bg-[#121215] border border-white/10 rounded-xl p-5 sm:p-6 mb-6">
              <ul className="space-y-3 text-xs sm:text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-white/40 font-bold shrink-0">•</span>
                  <span><strong>Complete Self-Custody:</strong> The interface does not take custody or escrow of your tokens. Collateral balances remain locked directly in audited smart contract vaults.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-white/40 font-bold shrink-0">•</span>
                  <span><strong>Cryptographic Signatures:</strong> Every interaction, including order creation, outcome share redemption, and collateral deposit, requires your explicit cryptographic digital signature.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-white/40 font-bold shrink-0">•</span>
                  <span><strong>Programmatic Settlement:</strong> Market payouts, share burns, and margin checks are executed programmatically without discretionary human intervention.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="terms-risk-disclosure" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">12. Substantive Financial Risk Disclosure</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Trading prediction markets and leveraged perpetual derivatives carries substantial financial risk. You may lose your entire principal deposited as collateral.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="font-mono text-white/40">01</span> Binary Outcome Dynamics
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Prediction market outcome shares resolve strictly to either $1.00 USDG (winning side) or $0.00 USDG (losing side). If an outcome does not materialize, the losing position retains zero value upon market resolution.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 rounded-xl p-5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="font-mono text-white/40">02</span> Leverage Volatility & Liquidations
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Probability Perps offer up to 10x leverage. Magnified leverage accelerates both profits and losses. If the index price moves past your maintenance threshold, automated liquidation contracts will close your position.
                </p>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section id="terms-no-financial-advice" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">13. No Financial or Investment Advice</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              All information presented across EDGE Protocol—including orderbook pricing, social Callout posts, leaderboards, and market charts—is provided strictly for educational and informational purposes.
            </p>
            <div className="bg-[#0b0b0e] border border-white/10 rounded-xl p-5 text-xs sm:text-sm text-white/70 leading-relaxed">
              <strong>NO CONTENT CONSTITUTES INVESTMENT, LEGAL, TAX, OR FINANCIAL ADVICE.</strong> You are solely responsible for conducting independent research and evaluating your personal financial circumstances before submitting capital.
            </div>
          </section>

          {/* Section 14 */}
          <section id="terms-oracle-resolution" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">14. Oracle Resolution & Settlement Criteria</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Each prediction market is paired with specific, transparent resolution criteria designated during smart contract creation:
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-white/70 mb-6">
              <div className="p-4 rounded-xl bg-[#121215] border border-white/10">
                <span className="font-bold text-white block mb-1">Atmospheric & Weather Markets</span>
                <span>Resolutions are determined strictly from factual meteorological sensor data published by official national providers (Open-Meteo, NOAA/NWS).</span>
              </div>

              <div className="p-4 rounded-xl bg-[#121215] border border-white/10">
                <span className="font-bold text-white block mb-1">Crypto & Economic Indices</span>
                <span>Resolutions utilize verifiable oracle price feeds aggregated across benchmark volume exchanges (Coinbase, Chainlink, Binance).</span>
              </div>

              <div className="p-4 rounded-xl bg-[#121215] border border-white/10">
                <span className="font-bold text-white block mb-1">Current Events & Primary Sources</span>
                <span>Resolutions adhere strictly to the verifiable primary authority specified in the deployed contract market description.</span>
              </div>
            </div>
            <p className="text-xs text-white/40">
              In cases where an event outcome is rendered objectively unverifiable, the contracts trigger an INVALID resolution returning deposited collateral pro-rata to token holders.
            </p>
          </section>

          {/* Section 15 */}
          <section id="terms-perps-liquidation" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">15. Perpetuals, Margins & Liquidations</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Traders engaging in Probability Perps agree to the deterministic mathematical rules enforced by the exchange:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">RULE 01</div>
                <h4 className="text-sm font-bold text-white mb-2">Continuous Funding Payments</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Funding payments are automatically exchanged between Long and Short positions continuously to anchor mark prices to spot index values.
                </p>
              </div>

              <div className="bg-[#121215] border border-white/10 p-5 rounded-xl">
                <div className="text-xs font-mono text-white/40 mb-2">RULE 02</div>
                <h4 className="text-sm font-bold text-white mb-2">Autonomous Liquidation Engine</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  When an account margin ratio dips below the required maintenance percentage, smart contracts execute an on-chain liquidation to preserve vault solvency.
                </p>
              </div>
            </div>
          </section>

          {/* Section 16 */}
          <section id="terms-restricted-jurisdictions" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">16. Restricted Jurisdictions & Sanctions</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Access to EDGE Protocol interfaces is prohibited for any individual, corporation, or entity located within or operating under:
            </p>

            <div className="bg-[#121215] border border-white/10 rounded-xl p-5 sm:p-6 mb-6">
              <ul className="space-y-2 text-xs sm:text-sm text-white/70 list-disc list-inside mb-4">
                <li>Jurisdictions subject to comprehensive international sanctions administered by the United Nations or United States OFAC (including Cuba, Iran, North Korea, Syria, and sanctioned territories).</li>
                <li>Jurisdictions where participation in decentralized prediction markets, binary tokens, or leveraged derivatives is prohibited by statutory law.</li>
              </ul>
              <p className="text-xs text-white/50">
                Attempting to circumvent geographical limitations via virtual private networks (VPNs) or proxy masking constitutes an intentional violation of these Terms.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="terms-prohibited-conduct" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">17. Prohibited Conduct & Market Integrity</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Users agree not to engage in or encourage abusive, fraudulent, or manipulative behavior:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#121215] border border-white/10 p-4 sm:p-5 rounded-xl">
                <span className="font-bold text-white block mb-1 text-sm">Market Manipulation</span>
                <span className="text-xs text-white/60">Executing wash trades, spoofing limit orderbooks, or attempting to compromise oracle feeds.</span>
              </div>

              <div className="bg-[#121215] border border-white/10 p-4 sm:p-5 rounded-xl">
                <span className="font-bold text-white block mb-1 text-sm">Smart Contract Exploits</span>
                <span className="text-xs text-white/60">Attempting re-entrancy attacks, flash loan exploits, or unauthorized contract manipulation.</span>
              </div>

              <div className="bg-[#121215] border border-white/10 p-4 sm:p-5 rounded-xl">
                <span className="font-bold text-white block mb-1 text-sm">Social Feed Abuse</span>
                <span className="text-xs text-white/60">Distributing phishing links, malicious payloads, automated spam posts, or impersonating other traders.</span>
              </div>

              <div className="bg-[#121215] border border-white/10 p-4 sm:p-5 rounded-xl">
                <span className="font-bold text-white block mb-1 text-sm">Infrastructure Attacks</span>
                <span className="text-xs text-white/60">Flooding API endpoints or launching denial-of-service attacks against protocol relays.</span>
              </div>
            </div>
          </section>

          {/* Section 18 */}
          <section id="terms-limitation-liability" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">18. Limitation of Liability & Warranty Disclaimers</h3>
            <div className="bg-[#121215] border border-white/10 rounded-xl p-5 sm:p-6 mb-6">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                THE EDGE PROTOCOL USER INTERFACE AND SMART CONTRACTS ARE PROVIDED STRICTLY ON AN <strong>&quot;AS IS&quot;</strong> AND <strong>&quot;AS AVAILABLE&quot;</strong> BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
              <p className="text-xs text-white/60 leading-relaxed">
                To the greatest extent permitted by governing laws, EDGE Protocol developers, contributors, and operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from smart contract bugs, network congestion, slippage, liquidation executions, or asset losses.
              </p>
            </div>
          </section>

          {/* Section 19 */}
          <section id="terms-disclaimer" className="mb-14 scroll-mt-28">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">19. Amendments & Inquiries</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              These Terms may be updated periodically to accommodate decentralized governance votes, protocol enhancements, and evolving compliance mandates. Continued interaction with protocol interfaces following published updates constitutes acceptance of modified provisions.
            </p>
          </section>

          {/* Contact Section */}
          <section id="legal-contact" className="scroll-mt-28 p-6 sm:p-8 rounded-xl border border-white/15 bg-[#121215] mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-mono font-bold text-xs">20</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Official Compliance & Support
              </h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              For legal inquiries, regulatory inquiries, or formal communication with the compliance team, contact us directly via our verified communication lines:
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="mailto:legal@edgeprotocol.tech"
                className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all flex items-center gap-2"
              >
                <span>legal@edgeprotocol.tech</span>
              </a>

              <a
                href="https://x.com/Edgeprotocjoac"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-xs hover:bg-white/10 transition-all"
              >
                X (Twitter) @Edgeprotocjoac
              </a>

              <Link
                href="/docs"
                className="px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-xs hover:bg-white/10 transition-all"
              >
                Contract Architecture & Docs
              </Link>
            </div>
          </section>

        </main>
      </div>

      <LandingFooter />
    </div>
  );
}
