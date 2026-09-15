import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import { updateUserTradeStats } from '../services/userService';
import { sendVerificationOtpEmail } from '../services/emailService';
import { generateTotpSecret, verifyTotpCode } from '../utils/totp';
import { generateEvmWallet, encryptPrivateKey, decryptPrivateKey } from '../utils/wallet';

/**
 * Helper to dynamically extract network parameter from query/body with default 'TESTNET'
 */
const getNetworkFromReq = (req: Request): string => {
  const param = Array.isArray(req.query?.network)
    ? req.query.network[0]
    : req.query?.network || req.body?.network;
  return String(param || process.env.NETWORK || 'TESTNET').toUpperCase();
};

/**
 * Helper to reliably upsert user record to public.users table with conflict handling
 */
const upsertUserRow = async (row: Record<string, any>) => {
  if (row.id) {
    const { data: existing } = await supabase
      .from('users')
      .select('id, wallet_address, encrypted_private_key')
      .eq('id', row.id)
      .maybeSingle();

    if (existing) {
      const updateData = { ...row };
      // Preserve existing real wallet address if payload provides UNSET placeholder
      if (existing.wallet_address && existing.wallet_address.length === 42 && row.wallet_address?.startsWith('UNSET')) {
        delete updateData.wallet_address;
      }
      const { error: updateErr } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', row.id);
      if (!updateErr) {
        console.log(`[UserController] 📊 'public.users' record updated by id: ${row.id}`);
        return null;
      }
      console.warn(`[UserController] Update by id failed: ${updateErr.message}, falling back to upsert...`);
    }
  }

  let { error } = await supabase.from('users').upsert(row, { onConflict: 'id' });
  if (error) {
    console.warn(`[UserController] Upsert onConflict(id) notice: ${error.message}. Retrying onConflict(wallet_address,network)...`);
    const res2 = await supabase.from('users').upsert(row, { onConflict: 'wallet_address,network' });
    error = res2.error;
  }
  if (error) {
    console.error(`[UserController] ❌ Failed to upsert public.users record:`, error.message);
  } else {
    console.log(`[UserController] 📊 'public.users' record synced for: ${row.email || row.wallet_address}`);
  }
  return error;
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const rawAddress = String(req.params.address || '');
    if (!rawAddress) {
      return res.status(400).json({ error: 'Missing wallet address parameter' });
    }
    const normalized = rawAddress.toLowerCase();
    const network = getNetworkFromReq(req);

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
 * Register a new user with Email, Password, Handle, and Display Name via Supabase Auth & Custom EDGE Protocol Email OTP
 */
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName, handle } = req.body;
    console.log(`[UserController] 📝 Signup request received for email: ${email}`);

    if (!email || !password) {
      console.log(`[UserController] ❌ Signup failed: Missing email or password`);
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (password.length < 6) {
      console.log(`[UserController] ❌ Signup failed: Password too short`);
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${cleanEmail.split('@')[0]}`;
    const name = displayName?.trim() || userHandle.replace('@', '');

    // Generate a secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    console.log(`[UserController] 🔑 Generated OTP Code ${otpCode} for ${cleanEmail}`);

    // Check if user already exists in Supabase Admin
    const { data: userList } = await supabase.auth.admin.listUsers();
    const existingUser = userList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);

    if (existingUser && (existingUser.email_confirmed_at || existingUser.confirmed_at)) {
      console.log(`[UserController] ⚠️ Signup blocked: Email ${cleanEmail} is already registered.`);
      return res.status(400).json({
        success: false,
        error: 'Email address is already registered. Please sign in instead or use a different email.',
      });
    }

    // Check if handle is already taken by a different user
    const { data: handleCheck } = await supabase
      .from('users')
      .select('id, email')
      .ilike('handle', userHandle)
      .maybeSingle();

    if (handleCheck && handleCheck.email?.toLowerCase() !== cleanEmail) {
      console.log(`[UserController] ⚠️ Signup blocked: Handle ${userHandle} is already taken.`);
      return res.status(400).json({
        success: false,
        error: `Handle ${userHandle} is already taken. Please choose a different handle.`,
      });
    }

    let userId: string;

    if (existingUser) {
      console.log(`[UserController] 🔄 Unconfirmed user found (${existingUser.id}), updating credentials & re-sending OTP...`);
      // Update existing user with new password and metadata containing OTP
      const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password,
        user_metadata: {
          ...existingUser.user_metadata,
          displayName: name,
          handle: userHandle,
          otp_code: otpCode,
          otp_expires_at: otpExpiresAt,
        },
      });

      if (updateErr) {
        console.error(`[UserController] ❌ Failed to update existing user:`, updateErr.message);
        return res.status(400).json({ success: false, error: updateErr.message });
      }
      userId = updated.user.id;
    } else {
      console.log(`[UserController] 👤 Creating new user in Supabase Auth...`);
      // Create user via Admin API (email_confirm false initially)
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: false,
        user_metadata: {
          displayName: name,
          handle: userHandle,
          otp_code: otpCode,
          otp_expires_at: otpExpiresAt,
        },
      });

      if (createErr || !created.user) {
        console.error(`[UserController] ❌ Failed to create user:`, createErr?.message);
        return res.status(400).json({ success: false, error: createErr?.message || 'Failed to create user' });
      }
      userId = created.user.id;
    }

    // Create/update user record in 'users' database table
    const address = `UNSET_${userId}`;
    const currentNetwork = getNetworkFromReq(req);
    const defaultAvatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`;

    await upsertUserRow({
      id: userId,
      email: cleanEmail,
      handle: userHandle,
      username: userHandle,
      display_name: name,
      avatar_url: defaultAvatarUrl,
      wallet_address: address,
      network: currentNetwork,
      is_verified: false,
      is_active: false,
      is_2fa_enabled: false,
      total_trades: 0,
      historical_pnl_usdg: 0,
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    console.log(`[UserController] ✉️ Dispatching verification email to ${cleanEmail}...`);
    // Send custom EDGE Protocol OTP email (asynchronously in background to ensure fast API response)
    sendVerificationOtpEmail({
      to: cleanEmail,
      otpCode,
      name,
    }).catch(err => console.error('[SignupUser] Email dispatch error:', err));

    console.log(`[UserController] ✅ Signup completed for ${cleanEmail}. Awaiting OTP verification.`);

    return res.json({
      success: true,
      requiresVerification: true,
      message: 'Signup successful. Please enter the 6-digit verification code sent to your email.',
      email: cleanEmail,
    });
  } catch (err: any) {
    console.error(`[UserController] 💥 Signup exception:`, err);
    return res.status(500).json({ success: false, error: err.message || 'Signup failed' });
  }
};

/**
 * Verify Email with 6-Digit OTP Token
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    console.log(`[UserController] 🔍 Email verification request for: ${email}`);

    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit OTP code are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const inputCode = code.trim();

    // Check user in Supabase Auth
    const { data: userList } = await supabase.auth.admin.listUsers();
    const user = userList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      console.log(`[UserController] ❌ Account not found for verification: ${cleanEmail}`);
      return res.status(400).json({ success: false, error: 'User account not found. Please sign up again.' });
    }

    const storedOtp = user.user_metadata?.otp_code;
    const expiresAt = user.user_metadata?.otp_expires_at;

    let isValidOtp = false;

    // Check custom OTP verification
    if (storedOtp && String(storedOtp) === inputCode) {
      if (expiresAt && Date.now() > Number(expiresAt)) {
        console.log(`[UserController] ⚠️ OTP code expired for: ${cleanEmail}`);
        return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new code.' });
      }
      isValidOtp = true;
    } else {
      // Fallback try standard Supabase verifyOtp
      const { data: sbVerify } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: inputCode,
        type: 'signup',
      });
      if (sbVerify.user && sbVerify.session) {
        isValidOtp = true;
      }
    }

    if (!isValidOtp) {
      console.log(`[UserController] ❌ Invalid OTP code (${inputCode}) for: ${cleanEmail}`);
      return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your email.' });
    }

    console.log(`[UserController] ✅ OTP code verified successfully for: ${cleanEmail}`);

    // Confirm user's email in Supabase
    await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        otp_code: null,
      },
    });

    // Generate session token or sign in
    const userHandle = user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`;
    const name = user.user_metadata?.displayName || userHandle.replace('@', '');
    const userAddress = `UNSET_${user.id}`;
    const currentNetwork = getNetworkFromReq(req);
    const defaultAvatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`;

    // Sync verified email status into 'users' database table
    await upsertUserRow({
      id: user.id,
      email: cleanEmail,
      handle: userHandle,
      username: userHandle,
      display_name: name,
      avatar_url: defaultAvatarUrl,
      wallet_address: userAddress,
      network: currentNetwork,
      is_verified: true,
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return res.json({
      success: true,
      message: 'Email verified successfully. Please sign in to activate your account with 2FA.',
      user: {
        id: user.id,
        email: cleanEmail,
        address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
        handle: userHandle,
        displayName: name,
        avatarUrl: defaultAvatarUrl,
        isVerified: true,
        isActive: false,
        is2FAEnabled: false,
      },
    });
  } catch (err: any) {
    console.error(`[UserController] 💥 Email verification exception:`, err);
    return res.status(500).json({ success: false, error: err.message || 'Email verification failed' });
  }
};

/**
 * Strict Login User via Email + Password ONLY (Unregistered or wrong password returns 401)
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`[UserController] 🔐 Login request for email: ${email}`);

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
      console.log(`[UserController] ❌ Authentication failed for: ${cleanEmail}`);
      return res.status(401).json({
        success: false,
        error: 'Account not found or invalid email/password. Please check your credentials or sign up.',
      });
    }

    const user = data.user;
    const session = data.session;
    const userHandle = user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`;
    const name = user.user_metadata?.displayName || userHandle.replace('@', '');
    const defaultAvatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`;

    let totpSecret = user.user_metadata?.totp_secret;
    if (!totpSecret) {
      totpSecret = generateTotpSecret();
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          totp_secret: totpSecret,
        },
      });
    }

    const is2FASetup = user.user_metadata?.is2FASetup === true || user.user_metadata?.is2FAEnabled === true;
    console.log(`[UserController] 🔑 Login success for ${cleanEmail}. 2FA Status: ${is2FASetup ? 'ALREADY SETUP (Direct 2FA Prompt)' : 'NOT SETUP YET (QR Code Setup Required)'}`);

    const userAddress = `UNSET_${user.id}`;
    const currentNetwork = getNetworkFromReq(req);

    // Sync user data to 'users' database table
    await upsertUserRow({
      id: user.id,
      email: cleanEmail,
      handle: userHandle,
      username: userHandle,
      display_name: name,
      avatar_url: defaultAvatarUrl,
      wallet_address: userAddress,
      network: currentNetwork,
      is_verified: true,
      is_active: is2FASetup,
      is_2fa_enabled: is2FASetup,
      totp_secret: totpSecret,
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const qrCodeData = `otpauth://totp/EdgeProtocol:${encodeURIComponent(cleanEmail)}?secret=${totpSecret}&issuer=EdgeProtocol`;

    return res.json({
      success: true,
      requires2FA: true,
      is2FASetup,
      secretKey: totpSecret,
      qrCodeData,
      token: session.access_token,
      user: {
        id: user.id,
        email: cleanEmail,
        address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
        handle: userHandle,
        displayName: name,
        avatarUrl: defaultAvatarUrl,
        isVerified: true,
        isActive: is2FASetup,
        is2FAEnabled: is2FASetup,
      },
    });
  } catch (err: any) {
    console.error(`[UserController] 💥 Login exception:`, err);
    return res.status(401).json({ success: false, error: err.message || 'Invalid email or password' });
  }
};

/**
 * Verify 2FA TOTP Code & Activate Account
 */
export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    console.log(`[UserController] 🛡️ 2FA TOTP verification request for: ${email} (Code: ${code})`);

    if (!email || !code || code.trim().length < 6) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit 2FA code are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check user in Supabase Auth
    const { data: userList } = await supabase.auth.admin.listUsers();
    const user = userList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(400).json({ success: false, error: 'User account not found' });
    }

    const totpSecret = user.user_metadata?.totp_secret;
    let isValidCode = false;

    if (totpSecret) {
      isValidCode = verifyTotpCode(totpSecret, code);
    }

    if (!isValidCode) {
      console.log(`[UserController] ❌ 2FA TOTP verification failed for: ${cleanEmail} (Input: ${code})`);
      return res.status(400).json({
        success: false,
        error: 'Invalid 2FA Authenticator code. Please check your Google Authenticator app and try again.',
      });
    }

    console.log(`[UserController] ✅ 2FA Code verified successfully. Marking account as activated for: ${cleanEmail}`);
    // Mark 2FA as setup & enabled in user metadata
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        is2FASetup: true,
        is2FAEnabled: true,
        totp_secret: totpSecret,
      },
    });

    // Sync activation & 2FA status into 'users' database table
    const userAddress = `UNSET_${user.id}`;
    const userHandle = user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`;
    const displayName = user.user_metadata?.displayName || cleanEmail.split('@')[0];
    const currentNetwork = getNetworkFromReq(req);
    const defaultAvatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`;

    await upsertUserRow({
      id: user.id,
      email: cleanEmail,
      handle: userHandle,
      username: userHandle,
      display_name: displayName,
      avatar_url: defaultAvatarUrl,
      wallet_address: userAddress,
      network: currentNetwork,
      is_verified: true,
      is_active: true,
      is_2fa_enabled: true,
      totp_secret: totpSecret,
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    return res.json({
      success: true,
      message: '2FA Verification successful. Account activated.',
      token: bearerToken || undefined,
      user: {
        id: user.id,
        email: cleanEmail,
        address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
        handle: userHandle,
        displayName,
        avatarUrl: defaultAvatarUrl,
        isVerified: true,
        isActive: true,
        is2FAEnabled: true,
      },
    });
  } catch (err: any) {
    console.error(`[UserController] 💥 2FA verification exception:`, err);
    return res.status(500).json({ success: false, error: err.message || '2FA verification failed' });
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

    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const cleanEmail = user.email || dbUser?.email || '';
    const userHandle = dbUser?.handle || user.user_metadata?.handle || `@${cleanEmail.split('@')[0]}`;
    const name = dbUser?.display_name || user.user_metadata?.displayName || userHandle.replace('@', '');
    const avatarUrl = dbUser?.avatar_url || `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(userHandle)}`;

    const is2FA = dbUser?.is_2fa_enabled ?? (user.user_metadata?.is2FASetup === true);
    const isActive = dbUser?.is_active ?? (user.user_metadata?.is2FASetup === true);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: cleanEmail,
        address: dbUser?.wallet_address && dbUser.wallet_address.length === 42 ? dbUser.wallet_address : `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
        handle: userHandle,
        displayName: name,
        bio: dbUser?.bio || null,
        avatarUrl,
        isVerified: dbUser?.is_verified ?? true,
        isActive,
        is2FAEnabled: is2FA,
        totpSecret: dbUser?.totp_secret || user.user_metadata?.totp_secret,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Helper to resolve user from request parameters or auth session
 */
/**
 * Helper to resolve user from request parameters or auth session
 */
const resolveUserFromReq = async (req: any) => {
  if (req.user) return req.user;
  const param = String(req.body?.email || req.query?.email || req.body?.address || req.query?.address || req.body?.identifier || '').trim().toLowerCase();
  
  const { data: userList, error } = await supabase.auth.admin.listUsers();
  if (error || !userList || !userList.users) return null;

  if (param) {
    const found = userList.users.find(u =>
      u && (
        (u.email && u.email.toLowerCase() === param) ||
        u.id === param ||
        (u.user_metadata?.handle && u.user_metadata.handle.toLowerCase() === param.toLowerCase()) ||
        (u.user_metadata?.handle && `@${u.user_metadata.handle.toLowerCase().replace('@', '')}` === param.toLowerCase())
      )
    );
    if (found) return found;
  }

  return userList.users.find(u => u != null) || null;
};

/**
 * On-demand EVM Wallet Generation for User Profile
 */
export const generateWallet = async (req: Request, res: Response) => {
  try {
    const user = await resolveUserFromReq(req);
    if (!user) {
      return res.status(400).json({ success: false, error: 'User account not found' });
    }

    const email = user.email || `${user.user_metadata?.handle || user.id}@edgeprotocol.tech`;
    const currentNetwork = getNetworkFromReq(req);
    console.log(`[UserController] 🔑 Wallet generation requested for: ${email} (${user.id}) on network: ${currentNetwork}`);

    // Check if user already has an encrypted wallet in database
    const { data: existingUser } = await supabase
      .from('users')
      .select('wallet_address, encrypted_private_key, network')
      .eq('id', user.id)
      .maybeSingle();

    const isPlaceholder = !existingUser?.wallet_address || 
      existingUser.wallet_address.length !== 42 || 
      existingUser.wallet_address.startsWith('UNSET');

    if (existingUser && existingUser.encrypted_private_key && !isPlaceholder) {
      let decryptedKey = '';
      try {
        decryptedKey = decryptPrivateKey(existingUser.encrypted_private_key);
      } catch (e) {
        console.warn(`[UserController] Could not decrypt existing wallet key:`, e);
      }

      return res.json({
        success: true,
        hasWallet: true,
        address: existingUser.wallet_address,
        privateKey: decryptedKey || undefined,
        network: existingUser.network || currentNetwork,
        usdgBalance: 0,
        message: 'Wallet already generated.',
      });
    }

    // Generate new EVM Wallet
    const { address, privateKey } = generateEvmWallet();
    const encryptedKey = encryptPrivateKey(privateKey);

    // Update 'users' database table directly by id
    const { error: updateErr } = await supabase
      .from('users')
      .update({
        wallet_address: address,
        encrypted_private_key: encryptedKey,
        network: currentNetwork,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateErr) {
      console.warn(`[UserController] Update by id failed during generateWallet: ${updateErr.message}, falling back to upsert...`);
      await upsertUserRow({
        id: user.id,
        email,
        handle: user.user_metadata?.handle || `@${email.split('@')[0]}`,
        username: user.user_metadata?.handle || `@${email.split('@')[0]}`,
        display_name: user.user_metadata?.displayName || email.split('@')[0],
        wallet_address: address,
        network: currentNetwork,
        encrypted_private_key: encryptedKey,
        is_verified: true,
        is_active: true,
        is_2fa_enabled: true,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    console.log(`[UserController] ✅ EVM Wallet successfully generated & saved to DB for ${email}: ${address} (${currentNetwork})`);

    return res.json({
      success: true,
      hasWallet: true,
      address,
      privateKey,
      network: currentNetwork,
      usdgBalance: 0,
      message: 'Wallet generated successfully!',
    });
  } catch (err: any) {
    console.error(`[UserController] 💥 Wallet generation exception:`, err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to generate wallet' });
  }
};

/**
 * Get User Wallet Details (Public address & USDG Balance)
 */
export const getWalletDetails = async (req: Request, res: Response) => {
  try {
    const user = await resolveUserFromReq(req);
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }
    const currentNetwork = getNetworkFromReq(req);

    const { data: dbUser } = await supabase
      .from('users')
      .select('wallet_address, encrypted_private_key, network, historical_pnl_usdg')
      .eq('id', user.id)
      .maybeSingle();

    const isPlaceholder = !dbUser?.wallet_address || 
      dbUser.wallet_address.length !== 42 || 
      dbUser.wallet_address.startsWith('UNSET');

    if (!dbUser || !dbUser.encrypted_private_key || isPlaceholder) {
      return res.json({
        success: true,
        hasWallet: false,
        network: currentNetwork,
      });
    }

    return res.json({
      success: true,
      hasWallet: true,
      address: dbUser.wallet_address,
      network: dbUser.network || currentNetwork,
      usdgBalance: Number(dbUser.historical_pnl_usdg || 0),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Export Private Key (Requires 2FA Code Verification)
 */
export const exportPrivateKey = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: '6-digit 2FA code is required' });
    }

    const user = await resolveUserFromReq(req);
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    console.log(`[UserController] 🔐 Private Key export requested for: ${user.email || user.id}`);

    const totpSecret = user.user_metadata?.totp_secret;
    let isValidCode = false;

    if (totpSecret) {
      isValidCode = verifyTotpCode(totpSecret, code);
    }

    if (!isValidCode) {
      console.log(`[UserController] ❌ 2FA verification failed during Private Key export for: ${user.email || user.id}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid 2FA Authenticator code. Please check your Google Authenticator app and try again.',
      });
    }

    const { data: dbUser } = await supabase
      .from('users')
      .select('wallet_address, encrypted_private_key')
      .eq('id', user.id)
      .maybeSingle();

    if (!dbUser || !dbUser.encrypted_private_key) {
      return res.status(400).json({ success: false, error: 'Wallet has not been generated yet.' });
    }

    const privateKey = decryptPrivateKey(dbUser.encrypted_private_key);
    console.log(`[UserController] ✅ Private Key decrypted & exported successfully for ${user.email || user.id}`);

    return res.json({
      success: true,
      address: dbUser.wallet_address,
      privateKey,
    });
  } catch (err: any) {
    console.error(`[UserController] 💥 Export Private Key exception:`, err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to export private key' });
  }
};

