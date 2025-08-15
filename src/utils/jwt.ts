import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

// 生成 JWT 令牌
export const generateToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 環境變數未設定');
  }
  
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(payload as any, secret, { expiresIn } as any);
};

// 驗證 JWT 令牌
export const verifyToken = (token: string): TokenPayload => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET 環境變數未設定');
    }
    
    return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('無效的令牌');
  }
};