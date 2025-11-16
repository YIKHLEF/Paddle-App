/**
 * Middleware d'authentification JWT
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.utils';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// Étendre le type Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware pour protéger les routes avec authentification JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extraire le token du header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant',
      });
      return;
    }

    // Vérifier le token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification invalide ou expiré',
      });
      return;
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isActive: true,
        isVerified: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Compte désactivé',
      });
      return;
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    logger.error('Erreur dans le middleware d\'authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification',
    });
  }
};

/**
 * Middleware optionnel pour vérifier l'authentification sans bloquer
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true },
        });

        if (user) {
          req.user = {
            userId: user.id,
            email: user.email,
          };
        }
      }
    }

    next();
  } catch (error) {
    // En mode optionnel, on continue même en cas d'erreur
    next();
  }
};

/**
 * Middleware pour vérifier le type d'abonnement
 */
export const requireSubscription = (...tiers: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentification requise',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { subscriptionTier: true },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
        return;
      }

      if (!tiers.includes(user.subscriptionTier)) {
        res.status(403).json({
          success: false,
          message: 'Abonnement requis',
          requiredTiers: tiers,
          currentTier: user.subscriptionTier,
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Erreur dans requireSubscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur de vérification d\'abonnement',
      });
    }
  };
};
