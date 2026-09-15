-- Migration: Add encrypted_private_key to public.users table for on-demand EVM wallet generation
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS encrypted_private_key text NULL;
