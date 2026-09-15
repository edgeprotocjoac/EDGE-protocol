import crypto from 'crypto';

/**
 * Generate a new random EVM-compatible wallet (Address & Private Key)
 */
export function generateEvmWallet(): { address: string; privateKey: string } {
  const privateKeyBytes = crypto.randomBytes(32);
  const privateKey = '0x' + privateKeyBytes.toString('hex');

  // Derive EVM address (0x + 40 hex chars)
  const addressHash = crypto.createHash('sha256').update(privateKeyBytes).digest();
  const address = '0x' + addressHash.subarray(0, 20).toString('hex');

  return { address, privateKey };
}

const MASTER_KEY = process.env.WALLET_ENCRYPTION_SECRET || 'EDGE_PROTOCOL_MASTER_WALLET_KEY_32B_AES256';

/**
 * Encrypt private key using AES-256-GCM
 */
export function encryptPrivateKey(privateKey: string): string {
  const key = crypto.createHash('sha256').update(MASTER_KEY).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM encrypted private key string
 */
export function decryptPrivateKey(encryptedData: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted private key format');
  }
  const [ivHex, tagHex, encryptedHex] = parts;
  const key = crypto.createHash('sha256').update(MASTER_KEY).digest();
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
