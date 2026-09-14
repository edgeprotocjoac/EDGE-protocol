import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import { updateUserTradeStats } from '../services/userService';

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const rawAddress = String(req.params.address || '');
    if (!rawAddress) {
      return res.status(400).json({ error: 'Missing wallet address parameter' });
    }
    const normalized = rawAddress.toLowerCase();
    const networkParam = Array.isArray(req.query.network) ? req.query.network[0] : req.query.network;
    const network = String(networkParam || process.env.NETWORK || 'testnet').toLowerCase();

    // Trigger sync/update for user trade stats
    await updateUserTradeStats(normalized, network);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', normalized)
      .eq('network', network)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.json({
        user: {
          wallet_address: normalized,
          network,
          total_trades: 0,
          historical_pnl_usdg: 0,
        },
      });
    }

    res.json({ user: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress, email, handle, displayName } = req.body;
    
    const address = (walletAddress || email || '0x71c893a').toLowerCase();
    const userHandle = handle || (email ? `@${email.split('@')[0]}` : '@trader');
    const name = displayName || (userHandle.replace('@', 'Trader '));

    const token = `edge_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Try to get or create user profile
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', address)
      .maybeSingle();

    let user = existing;

    if (!user) {
      const { data: created } = await supabase
        .from('users')
        .insert({
          wallet_address: address,
          network: 'testnet',
          total_trades: 0,
          historical_pnl_usdg: 0,
        })
        .select()
        .maybeSingle();
      user = created;
    }

    return res.json({
      success: true,
      token,
      user: {
        id: user?.id || address,
        address,
        handle: userHandle,
        displayName: name,
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`,
        isVerified: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
