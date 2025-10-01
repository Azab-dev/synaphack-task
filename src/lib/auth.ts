import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'dev_secret';

export type AuthTokenPayload = { role: 'admin'; email: string };

export function signAdminToken(email: string) {
  const payload: AuthTokenPayload = { role: 'admin', email };
  return jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    if (decoded.role !== 'admin') return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getBearerToken(header: string | null): string | undefined {
  if (!header) return undefined;
  const [scheme, value] = header.split(' ');
  if (scheme !== 'Bearer') return undefined;
  return value;
}
