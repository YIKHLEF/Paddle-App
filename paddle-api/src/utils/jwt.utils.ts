/**
 * Utilitaires pour la gestion des JWT tokens
 */

import jwt from 'jsonwebtoken';
import { logger } from './logger';

// Types
interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Générer un access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';

  if (!secret) {
    throw new Error('JWT_SECRET n\'est pas défini');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Générer un refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET n\'est pas défini');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Générer une paire de tokens (access + refresh)
 */
export const generateTokenPair = (payload: TokenPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Vérifier un access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET n\'est pas défini');
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.error('Erreur de vérification du token:', error);
    return null;
  }
};

/**
 * Vérifier un refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET n\'est pas défini');
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.error('Erreur de vérification du refresh token:', error);
    return null;
  }
};

/**
 * Décoder un token sans le vérifier
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

/**
 * Extraire le token du header Authorization
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;

  // Format attendu: "Bearer TOKEN"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};
