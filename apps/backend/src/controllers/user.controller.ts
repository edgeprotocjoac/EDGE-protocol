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

/**
 * Register a new user with Email, Password, Handle, and Display Name via Supabase Auth
 */
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName, handle } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${cleanEmail.split('@')[0]}`;
    const name = displayName?.trim() || userHandle.replace('@', '');

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          displayName: name,
          handle: userHandle,
        },
      },
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const user = data.user;
    const session = data.session;

    // Create user record in 'users' table
    if (user) {
      const address = `0x${user.id.replace(/-/g, '').substring(0, 40)}`;
      await supabase
        .from('users')
        .upsert({
          id: user.id,
          wallet_address: address,
          network: 'testnet',
          total_trades: 0,
          historical_pnl_usdg: 0,
        }, { onConflict: 'id' });
    }

    // Check if session exists (auto-confirmed) or requires verification
    if (session) {
      return res.json({
        success: true,
        requiresVerification: false,
        token: session.access_token,
        user: {
          id: user?.id,
          email: cleanEmail,
          address: `0x${user?.id.replace(/-/g, '').substring(0, 40)}`,
          handle: userHandle,
          displayName: name,
          avatarUrl: `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`,
          isVerified: true,
        },
      });
    }

    return res.json({
      success: true,
      requiresVerification: true,
      message: 'Signup successful. Please enter the verification code sent to your email.',
      email: cleanEmail,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Signup failed' });
  }
};

/**
 * Verify Email with OTP Token
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit OTP code are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify OTP with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: code.trim(),
      type: 'signup',
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const user = data.user;
    const session = data.session;

    if (!session || !user) {
      return res.status(400).json({ success: false, error: 'Failed to establish session after verification' });
    }

    const userHandle = user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`;
    const name = user.user_metadata?.displayName || userHandle.replace('@', '');

    return res.json({
      success: true,
      token: session.access_token,
      user: {
        id: user.id,
        email: cleanEmail,
        address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
        handle: userHandle,
        displayName: name,
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`,
        isVerified: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Email verification failed' });
  }
};

/**
 * Strict Login User via Email + Password ONLY (Unregistered or wrong password returns 401)
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Authenticate credentials against Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error || !data.session || !data.user) {
      return res.status(401).json({
        success: false,
        error: 'Account not found or invalid email/password. Please check your credentials or sign up.',
      });
    }

    const user = data.user;
    const session = data.session;
    const userHandle = user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`;
    const name = user.user_metadata?.displayName || userHandle.replace('@', '');

    return res.json({
      success: true,
      token: session.access_token,
      user: {
        id: user.id,
        email: cleanEmail,
        address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
        handle: userHandle,
        displayName: name,
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`,
        isVerified: true,
      },
    });
  } catch (err: any) {
    return res.status(401).json({ success: false, error: err.message || 'Invalid email or password' });
  }
};

/**
 * Get current authenticated user profile
 */
export const getAuthUser = async (req: any, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const userHandle = user.user_metadata?.handle || `@${(user.email || '').split('@')[0]}`;
    const name = user.user_metadata?.displayName || userHandle.replace('@', '');

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
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
