-- Migration: Auto-sync Supabase Auth users to public.users table via Database Trigger

-- 1. Create or replace the trigger function
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

-- 2. Drop existing trigger if present and create new trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

