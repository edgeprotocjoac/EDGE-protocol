-- Migration: Add auth & 2FA metadata columns to public.users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_2fa_enabled boolean DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS totp_secret text;

-- Index for fast email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email);
