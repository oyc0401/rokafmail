import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET!;

export interface AuthUser {
  username: string;
  role: 'admin' | 'trainee';
  provider: 'credential' | 'google';
  uid?: string;
}

export interface AuthSession {
  user: AuthUser;
}

/**
 * JWT 토큰 생성
 */
export function createToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * JWT 토큰 검증 (기존 auth() 대체)
 */
export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return {
      user: {
        username: decoded.username,
        role: decoded.role,
        provider: decoded.provider,
        uid: decoded.uid
      }
    };
  } catch {
    return null;
  }
}

/**
 * Authorization 헤더에서 토큰 추출
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return authHeader;
}
