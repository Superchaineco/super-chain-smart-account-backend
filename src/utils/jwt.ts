import { SESSION_SECRET } from '@/config/superChain/constants';
import jwt from 'jsonwebtoken';

const JWT_SECRET = SESSION_SECRET ;

export function signJwt(payload: object, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
