import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NetworkType, ProfileDTO, CreatorStatsDTO } from '../types/social';

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) throw new Error('Missing required env: SUPABASE_URL');

  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseKey) throw new Error('Missing required env: SUPABASE_SERVICE_ROLE_KEY');

  return createClient(supabaseUrl, supabaseKey);
}

export async function getProfileByHandle(
  handle: string,
  network: NetworkType = 'testnet'
): Promise<ProfileDTO | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('handle', handle)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    walletAddress: data.wallet_address,
    handle: data.handle,
    displayName: data.display_name,
    bio: data.bio || null,
    avatarUrl: data.avatar_url,
    xHandle: data.x_handle || null,
    isVerified: Boolean(data.is_verified),
    createdAt: new Date(data.created_at),
  };
}

export async function getProfileByWallet(
  walletAddress: string
): Promise<ProfileDTO | null> {
  const supabase = getSupabaseClient();
  const rawParam = walletAddress.trim();
  const normalizedWallet = rawParam.toLowerCase();

  // Parse 0x+32hex or UNSET_ into standard UUID format if needed
  let possibleUuid = rawParam;
  if (normalizedWallet.startsWith('0x') && normalizedWallet.length === 34) {
    const hex = normalizedWallet.slice(2);
    possibleUuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  } else if (normalizedWallet.startsWith('unset_')) {
    possibleUuid = rawParam.substring(6);
  }

  // Query users table by wallet_address, id UUID, email, or UNSET_UUID
  const { data } = await supabase
    .from('users')
    .select('*')
    .or(`wallet_address.ilike.${normalizedWallet},id.eq.${possibleUuid},email.ilike.${normalizedWallet},wallet_address.ilike.UNSET_${possibleUuid}`)
    .maybeSingle();

  if (data) {
    const handle = data.handle || data.username || `@${(data.email || 'user').split('@')[0]}`;
    const avatarUrl = data.avatar_url || `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(handle)}`;

    return {
      id: data.id || data.wallet_address,
      walletAddress: data.wallet_address || normalizedWallet,
      handle,
      displayName: data.display_name || data.username || handle.replace('@', ''),
      bio: data.bio || null,
      avatarUrl,
      xHandle: data.x_handle || null,
      isVerified: Boolean(data.is_verified ?? true),
      createdAt: new Date(data.created_at || Date.now()),
    };
  }

  // Fallback: Check Supabase Auth user by ID if users table record was not created yet
  try {
    const { data: authUser } = await supabase.auth.admin.getUserById(walletAddress);
    if (authUser?.user) {
      const user = authUser.user;
      const cleanEmail = user.email || '';
      const userHandle = user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`;
      const name = user.user_metadata?.displayName || userHandle.replace('@', '');

      // Auto-upsert into users table
      await supabase.from('users').upsert({
        id: user.id,
        email: cleanEmail,
        handle: userHandle,
        username: userHandle,
        display_name: name,
        wallet_address: normalizedWallet,
        network: (process.env.NETWORK || 'testnet').toLowerCase(),
        is_verified: true,
        is_active: user.user_metadata?.is2FASetup === true,
        is_2fa_enabled: user.user_metadata?.is2FASetup === true,
        total_trades: 0,
        historical_pnl_usdg: 0,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'wallet_address, network' });

      return {
        id: user.id,
        walletAddress: normalizedWallet,
        handle: userHandle,
        displayName: name,
        bio: undefined,
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`,
        xHandle: undefined,
        isVerified: true,
        createdAt: new Date(user.created_at),
      };
    }
  } catch (err) {
    console.warn('[ProfileService] Supabase Auth user fallback check warning:', err);
  }

  return null;
}

export async function createOrUpdateProfile(data: {
  walletAddress: string;
  handle: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  xHandle?: string;
}): Promise<ProfileDTO> {
  const supabase = getSupabaseClient();
  const normalizedWallet = data.walletAddress.toLowerCase();

  const payload = {
    wallet_address: normalizedWallet,
    network: (process.env.NETWORK || 'testnet').toLowerCase(),
    handle: data.handle,
    username: data.handle,
    display_name: data.displayName,
    bio: data.bio || null,
    avatar_url: data.avatarUrl || `https://api.dicebear.com/9.x/thumbs/svg?seed=${data.handle}`,
    x_handle: data.xHandle || null,
    updated_at: new Date().toISOString(),
  };

  const { data: profile, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'wallet_address, network' })
    .select('*')
    .single();

  if (error || !profile) {
    throw new Error(`Failed to create or update profile: ${error?.message || 'Unknown error'}`);
  }

  // Synchronize users table as well if present
  try {
    const network = (process.env.NETWORK || 'testnet').toLowerCase();
    await supabase.from('users').upsert({
      wallet_address: normalizedWallet,
      network,
      username: data.handle,
      handle: data.handle,
      display_name: data.displayName,
      bio: payload.bio,
      avatar_url: payload.avatar_url,
      x_handle: payload.x_handle,
      last_active: payload.updated_at,
    }, { onConflict: 'wallet_address, network' });
  } catch (userSyncErr) {
    // Non-blocking warning if users table structure is different
    console.warn('Sync to users table skipped/warn:', userSyncErr);
  }

  return {
    id: profile.id,
    walletAddress: profile.wallet_address,
    handle: profile.handle,
    displayName: profile.display_name,
    bio: profile.bio || null,
    avatarUrl: profile.avatar_url,
    xHandle: profile.x_handle || null,
    isVerified: Boolean(profile.is_verified),
    createdAt: new Date(profile.created_at),
  };
}

export async function getProfileStats(
  profileId: string,
  network: NetworkType = 'testnet'
): Promise<CreatorStatsDTO | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('creator_stats')
    .select('*')
    .eq('profile_id', profileId)
    .eq('network', network)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    network: data.network as NetworkType,
    profileId: data.profile_id,
    totalCalls: data.total_calls || 0,
    resolvedCalls: data.resolved_calls || 0,
    correctCalls: data.correct_calls || 0,
    incorrectCalls: data.incorrect_calls || 0,
    accuracy: Number(data.accuracy || 0),
    edgeScore: Number(data.edge_score || 0),
    currentStreak: data.current_streak || 0,
    bestStreak: data.best_streak || 0,
    avgCallProbability: Number(data.avg_call_probability || 0),
    volumeAttributed: Number(data.volume_attributed || 0),
    followersCount: data.followers_count || 0,
    followingCount: data.following_count || 0,
    updatedAt: new Date(data.updated_at),
  };
}
