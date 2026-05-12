import { decodeBase64 } from './base64.lib';

export interface JwtParts {
  header: unknown;
  payload: unknown;
  signature: string;
}

/** Decode the header & payload of a JWT. Does not verify the signature. */
export function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('A JWT must have three segments separated by "."');
  }
  const [h, p, s] = parts;
  return {
    header: JSON.parse(decodeBase64(h)),
    payload: JSON.parse(decodeBase64(p)),
    signature: s,
  };
}
