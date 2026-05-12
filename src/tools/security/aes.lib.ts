/**
 * AES-GCM symmetric encryption with PBKDF2 key derivation.
 * Output: base64( salt(16) || iv(12) || ciphertext )
 */

const SALT_LEN = 16;
const IV_LEN = 12;
const ITER = 100_000;

function bufToB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64ToBytes(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ITER, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptAesGcm(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const key = await deriveKey(password, salt);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext),
  );
  const ctArr = new Uint8Array(ct);
  const out = new Uint8Array(SALT_LEN + IV_LEN + ctArr.length);
  out.set(salt, 0);
  out.set(iv, SALT_LEN);
  out.set(ctArr, SALT_LEN + IV_LEN);
  return bufToB64(out);
}

export async function decryptAesGcm(b64: string, password: string): Promise<string> {
  const all = b64ToBytes(b64);
  if (all.length < SALT_LEN + IV_LEN + 16) throw new Error('ciphertext too short');
  const salt = all.slice(0, SALT_LEN);
  const iv = all.slice(SALT_LEN, SALT_LEN + IV_LEN);
  const ct = all.slice(SALT_LEN + IV_LEN);
  const key = await deriveKey(password, salt);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ct as BufferSource,
  );
  return new TextDecoder().decode(pt);
}
