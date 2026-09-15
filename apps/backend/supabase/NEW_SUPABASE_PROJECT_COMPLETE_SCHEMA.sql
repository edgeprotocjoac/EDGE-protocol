-- ====================================================================
-- EDGE PROTOCOL - MASTER DATABASE SCHEMA
-- Target: NEW Supabase Project (sjojpkuogitwgwxlrfhn)
-- ====================================================================

-- 0. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. USERS & PROFILES LAYER
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    wallet_address TEXT NOT NULL,
    network TEXT NOT NULL DEFAULT 'TESTNET',
    username TEXT,
    handle TEXT,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    x_handle TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_2fa_enabled BOOLEAN DEFAULT FALSE,
    totp_secret TEXT,
    encrypted_private_key TEXT,
    total_trades INTEGER DEFAULT 0,
    historical_pnl_usdg NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (wallet_address, network)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON public.users (wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_handle ON public.users (handle);

-- Backward-compatibility view for profiles queries
CREATE OR REPLACE VIEW public.profiles AS
SELECT 
  id,
  wallet_address,
  COALESCE(handle, username, 'trader') AS handle,
  COALESCE(display_name, handle, username, 'Trader') AS display_name,
  bio,
  avatar_url,
  x_handle,
  COALESCE(is_verified, false) AS is_verified,
  created_at,
  updated_at
FROM public.users;

-- Auto-sync Supabase Auth users to public.users table via Database Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    wallet_address,
    network,
    display_name,
    handle,
    username,
    is_verified,
    is_active,
    is_2fa_enabled,
    total_trades,
    historical_pnl_usdg,
    last_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    LOWER(COALESCE('0x' || REPLACE(NEW.id::text, '-', ''), '0x0000000000000000000000000000000000000000')),
    UPPER(COALESCE(current_setting('app.current_network', true), 'TESTNET')),
    COALESCE(NEW.raw_user_meta_data->>'displayName', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'handle', '@' || SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'handle', '@' || SPLIT_PART(NEW.email, '@', 1)),
    false,
    false,
    false,
    0,
    0,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, public.users.display_name),
    handle = COALESCE(EXCLUDED.handle, public.users.handle),
    username = COALESCE(EXCLUDED.username, public.users.username),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================================
-- 2. SPOT PREDICTION MARKETS & ORDERS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.markets (
    id TEXT,
    network TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    image_url TEXT,
    resolution_rules TEXT,
    category TEXT,
    close_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'OPEN',
    resolver_address TEXT,
    total_volume_usdg NUMERIC DEFAULT 0,
    current_yes_probability NUMERIC DEFAULT 50.0,
    winning_outcome TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, network)
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    network TEXT,
    market_id TEXT NOT NULL,
    wallet_address TEXT,
    user_address TEXT,
    outcome TEXT,
    side TEXT,
    order_type TEXT DEFAULT 'LIMIT',
    amount NUMERIC,
    amount_usdg NUMERIC,
    shares_amount NUMERIC,
    price NUMERIC,
    price_per_share NUMERIC,
    signature TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN',
    filled_amount NUMERIC DEFAULT 0,
    raw_order JSONB,
    transaction_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_market_status ON public.orders(market_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_wallet ON public.orders(wallet_address);

CREATE TABLE IF NOT EXISTS public.trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    network TEXT NOT NULL,
    market_id TEXT NOT NULL,
    buy_order_id UUID,
    sell_order_id UUID,
    price NUMERIC NOT NULL,
    amount NUMERIC NOT NULL,
    buyer_address TEXT NOT NULL,
    seller_address TEXT NOT NULL,
    transaction_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trades_market_time ON public.trades(market_id, network, created_at DESC);

-- ====================================================================
-- 3. PERPETUAL FUTURES MARKETS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.perp_markets (
    id TEXT PRIMARY KEY,
    network TEXT NOT NULL,
    prediction_market_id TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    max_leverage NUMERIC NOT NULL,
    initial_margin_rate NUMERIC NOT NULL,
    maintenance_margin_rate NUMERIC NOT NULL,
    max_open_interest NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.perp_orders (
    id TEXT PRIMARY KEY,
    network TEXT NOT NULL,
    market_id TEXT NOT NULL,
    trader TEXT NOT NULL,
    side TEXT NOT NULL,
    size NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    margin NUMERIC NOT NULL,
    leverage NUMERIC NOT NULL,
    signature TEXT NOT NULL,
    nonce NUMERIC NOT NULL,
    expiration TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    filled_amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perp_orders_market_status ON public.perp_orders(market_id, status);
CREATE INDEX IF NOT EXISTS idx_perp_orders_trader ON public.perp_orders(trader);

CREATE TABLE IF NOT EXISTS public.perp_positions (
    id TEXT PRIMARY KEY,
    network TEXT NOT NULL,
    trader TEXT NOT NULL,
    market_id TEXT NOT NULL,
    side TEXT NOT NULL,
    size NUMERIC NOT NULL,
    entry_price NUMERIC NOT NULL,
    margin NUMERIC NOT NULL,
    leverage NUMERIC NOT NULL,
    unrealized_pnl NUMERIC NOT NULL DEFAULT 0,
    realized_pnl NUMERIC NOT NULL DEFAULT 0,
    funding_accrued NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perp_positions_market_status ON public.perp_positions(market_id, status);
CREATE INDEX IF NOT EXISTS idx_perp_positions_trader ON public.perp_positions(trader);

CREATE TABLE IF NOT EXISTS public.perp_fills (
    id TEXT PRIMARY KEY,
    network TEXT NOT NULL,
    match_id TEXT NOT NULL,
    maker_order_id TEXT NOT NULL,
    taker_order_id TEXT NOT NULL,
    market_id TEXT NOT NULL,
    size NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.perp_funding_rates (
    id TEXT PRIMARY KEY,
    network TEXT NOT NULL,
    market_id TEXT NOT NULL,
    rate NUMERIC NOT NULL,
    mark_price NUMERIC NOT NULL,
    index_price NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.perp_liquidations (
    id TEXT PRIMARY KEY,
    network TEXT NOT NULL,
    trader TEXT NOT NULL,
    market_id TEXT NOT NULL,
    position_id TEXT NOT NULL,
    mark_price NUMERIC NOT NULL,
    penalty_amount NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.perp_index_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    market_id TEXT NOT NULL,
    network TEXT NOT NULL,
    price NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_perp_index_prices_time ON public.perp_index_prices(market_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS public.perp_mark_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    market_id TEXT NOT NULL,
    network TEXT NOT NULL,
    price NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_perp_mark_prices_time ON public.perp_mark_prices(market_id, timestamp DESC);

-- ====================================================================
-- 4. SOCIAL, CALLOUTS, LEADERBOARD, FEED
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.callouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network VARCHAR(20) NOT NULL DEFAULT 'testnet',
    creator_id UUID,
    headline TEXT NOT NULL,
    thesis TEXT,
    category VARCHAR(50) NOT NULL,
    conviction VARCHAR(10) NOT NULL CHECK (conviction IN ('YES', 'NO')),
    confidence INTEGER NOT NULL CHECK (confidence BETWEEN 50 AND 99),
    market_id VARCHAR(100),
    market_proposal_id UUID,
    call_probability NUMERIC(5,2) NOT NULL,
    current_probability NUMERIC(5,2) NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'LIVE',
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    reposts INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    trades_attributed INTEGER DEFAULT 0,
    volume_attributed VARCHAR(50) DEFAULT '$0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.callout_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network VARCHAR(20) NOT NULL DEFAULT 'testnet',
    callout_id UUID NOT NULL,
    probability_at_call NUMERIC(5,2) NOT NULL,
    market_id VARCHAR(100) NOT NULL,
    market_rules_hash VARCHAR(66),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.callout_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network VARCHAR(20) NOT NULL DEFAULT 'testnet',
    callout_id UUID NOT NULL,
    outcome VARCHAR(10) NOT NULL CHECK (outcome IN ('YES', 'NO', 'INVALID')),
    prediction_edge NUMERIC(8,2) NOT NULL,
    resolved_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    callout_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, callout_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    callout_id UUID NOT NULL,
    parent_id UUID,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    comment_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, comment_id)
);

CREATE TABLE IF NOT EXISTS public.reposts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    callout_id UUID NOT NULL,
    quote TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    callout_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, callout_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network VARCHAR(20) NOT NULL DEFAULT 'testnet',
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    ref_id VARCHAR(100),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creator_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network VARCHAR(20) NOT NULL DEFAULT 'testnet',
    profile_id UUID NOT NULL,
    total_calls INTEGER DEFAULT 0,
    resolved_calls INTEGER DEFAULT 0,
    correct_calls INTEGER DEFAULT 0,
    incorrect_calls INTEGER DEFAULT 0,
    accuracy NUMERIC(5,2) DEFAULT 0.00,
    edge_score NUMERIC(10,2) DEFAULT 0.00,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    avg_call_probability NUMERIC(5,2) DEFAULT 0.00,
    volume_attributed NUMERIC(18,2) DEFAULT 0.00,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (network, profile_id)
);

CREATE TABLE IF NOT EXISTS public.market_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network VARCHAR(20) NOT NULL DEFAULT 'testnet',
    proposer_id UUID NOT NULL,
    question TEXT NOT NULL,
    yes_condition TEXT NOT NULL,
    no_condition TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    resolution_source TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    network TEXT NOT NULL,
    wallet_address TEXT,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.markets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.callouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.callout_snapshots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.callout_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reposts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_markets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_positions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_fills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_funding_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_liquidations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_index_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perp_mark_prices DISABLE ROW LEVEL SECURITY;
