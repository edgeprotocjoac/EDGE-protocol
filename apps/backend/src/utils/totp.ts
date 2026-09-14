import crypto from 'crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Decode a Base32 string to Buffer
 */
export function base32Decode(base32Str: string): Buffer {
  const cleaned = base32Str.replace(/=+$/, '').toUpperCase();
  let bits = '';
  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/**
 * Encode Buffer to Base32 string
 */
export function base32Encode(buffer: Buffer): string {
  let bits = '';
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, '0');
  }
  let base32 = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, '0');
    base32 += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return base32;
}

/**
 * Generate a random Base32 TOTP secret key
 */
export function generateTotpSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Calculate RFC 6238 6-digit TOTP code for a given secret
 */
export function generateTotpCode(secret: string, timeStep = 30, timeOffset = 0): string {
  try {
    const secretBuffer = base32Decode(secret);
    if (secretBuffer.length === 0) return '000000';

    const epoch = Math.floor(Date.now() / 1000) + (timeOffset * timeStep);
    const timeHex = Math.floor(epoch / timeStep).toString(16).padStart(16, '0');
    const timeBuffer = Buffer.from(timeHex, 'hex');

    const hmac = crypto.createHmac('sha1', secretBuffer);
    hmac.update(timeBuffer);
    const digest = hmac.digest();

    const offset = digest[digest.length - 1] & 0x0f;
    const binary =
      ((digest[offset] & 0x7f) << 24) |
      ((digest[offset + 1] & 0xff) << 16) |
      ((digest[offset + 2] & 0xff) << 8) |
      (digest[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  } catch (_) {
    return '000000';
  }
}

/**
 * Verify TOTP 6-digit code against secret key (allowing +- 30s clock drift)
 */
export function verifyTotpCode(secret: string, code: string): boolean {
  const cleanCode = code.trim();
  if (cleanCode.length !== 6 || !/^\d+$/.test(cleanCode)) {
    return false;
  }

  for (let offset = -1; offset <= 1; offset++) {
    const expected = generateTotpCode(secret, 30, offset);
    if (expected === cleanCode) {
      return true;
    }
  }
  return false;
}
