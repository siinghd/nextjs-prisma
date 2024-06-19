import { SignJWT, jwtVerify } from 'jose';
import { hash, verify } from '@node-rs/argon2';

const JWT_PASSWORD_SECRET =
  process.env.JWT_PASSWORD_SECRET || 'your_jwt_PASSWORD_SECRET_key';

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return verify(hash, password);
};

export const generateToken = async (
  email: string,
  companyId: string,
  role: string
): Promise<string> => {
  return new SignJWT({ email, companyId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_PASSWORD_SECRET));
};

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_PASSWORD_SECRET)
    );
    return payload;
  } catch (err) {
    throw new Error('Invalid or expired token.');
  }
};
