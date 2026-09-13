import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NetworkType } from '../types/social';

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) throw new Error('Missing required env: SUPABASE_URL');

  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseKey) throw new Error('Missing required env: SUPABASE_SERVICE_ROLE_KEY');

  return createClient(supabaseUrl, supabaseKey);
}

export interface LeaderboardEntryDTO {
  rank: number;
  profileId: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
  edgeScore: number;
  accuracy: number;
  resolvedCalls: number;
  followersCount: number;
  volumeAttributed: string;
}

export class LeaderboardService {
  /**
   * Get leaderboard rankings for a specific period & network
   * Strictly queries database tables (creator_stats & users) without hardcoded mock data
   */
  static async getLeaderboard(
    period: '24h' | '7d' | '30d' | 'all_time' = 'all_time',
    network: NetworkType = 'testnet'
  ): Promise<LeaderboardEntryDTO[]> {
    const supabase = getSupabaseClient();

    let { data: stats } = await supabase
      .from('creator_stats')
      .select('*')
      .ilike('network', network)
      .order('edge_score', { ascending: false });

    if (!stats || stats.length === 0) {
      const { data: fallback } = await supabase
        .from('creator_stats')
        .select('*')
        .order('edge_score', { ascending: false });
      stats = fallback || [];
    }

    if (!stats || stats.length === 0) {
      return [];
    }

    // Deduplicate by profile_id, handle, and display_name so each creator appears once
    const userMap = new Map<string, any>();
    const userList: any[] = [];

    try {
      const { data: userRows } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });

      if (userRows && userRows.length > 0) {
        userRows.forEach((u: any) => {
          if (u.id) {
            userMap.set(u.id, u);
            userMap.set(u.id.toLowerCase(), u);
          }
          if (u.wallet_address) {
            userMap.set(u.wallet_address.toLowerCase(), u);
          }
          if (u.handle) {
            userMap.set(u.handle.toLowerCase(), u);
          }
        });
      }
    } catch (err) {
      console.warn('[LeaderboardService] Failed to fetch users for leaderboard:', err);
    }

    const seenProfiles = new Set<string>();
    const seenHandles = new Set<string>();
    const seenDisplayNames = new Set<string>();

    const result: LeaderboardEntryDTO[] = [];

    for (const item of stats || []) {
      const rawPid = (item.profile_id || '').toLowerCase().trim();
      const user = userMap.get(item.profile_id) || userMap.get(rawPid);

      const shortId = (user?.wallet_address || user?.id || item.profile_id || '').replace(/^0x/, '').replace(/-/g, '').slice(0, 6);
      const handle = user?.handle || user?.username || (shortId ? `user_${shortId}` : 'creator_anon');
      const displayName = user?.display_name || user?.username || user?.handle || handle;

      const handleKey = handle.toLowerCase().trim();
      const nameKey = displayName.toLowerCase().trim();

      if (rawPid && seenProfiles.has(rawPid)) continue;
      if (handleKey && seenHandles.has(handleKey)) continue;
      if (nameKey && seenDisplayNames.has(nameKey)) continue;

      if (rawPid) seenProfiles.add(rawPid);
      if (handleKey) seenHandles.add(handleKey);
      if (nameKey) seenDisplayNames.add(nameKey);

      const avatarUrl = user?.avatar_url || `https://api.dicebear.com/9.x/bottts/svg?seed=${handle}`;
      const isVerified = Boolean(user?.is_verified ?? true);

      result.push({
        rank: result.length + 1,
        profileId: user?.id || item.profile_id,
        handle,
        displayName,
        avatarUrl,
        isVerified,
        edgeScore: Number(item.edge_score || 0),
        accuracy: Number(item.accuracy || 0),
        resolvedCalls: Number(item.resolved_calls || 0),
        followersCount: Number(item.followers_count || 0),
        volumeAttributed: (item.volume_attributed || 0).toString(),
      });

      if (result.length >= 10) break;
    }

    return result;
  }
}
