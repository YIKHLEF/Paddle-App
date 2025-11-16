/**
 * Service d'authentification
 */

import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import prisma from '../config/database';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.utils';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

// Types
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: Date;
  gender: string;
  skillLevel: string;
  preferredPosition: string;
  dominantHand: string;
  location: string;
  phoneNumber?: string;
}

interface LoginResponse {
  user: Partial<User>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(data: RegisterData): Promise<LoginResponse> {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new AppError('Cet email est déjà utilisé', 400);
      }

      // Vérifier si le username existe déjà
      const existingUsername = await prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existingUsername) {
        throw new AppError('Ce nom d\'utilisateur est déjà pris', 400);
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(data.password, salt);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender as any,
          skillLevel: data.skillLevel as any,
          preferredPosition: data.preferredPosition as any,
          dominantHand: data.dominantHand as any,
          location: data.location,
          phoneNumber: data.phoneNumber,
        },
      });

      // Créer les statistiques utilisateur
      await prisma.userStatistics.create({
        data: {
          userId: user.id,
        },
      });

      // Générer les tokens
      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
      });

      // Retourner l'utilisateur sans le mot de passe
      const { passwordHash: _, ...userWithoutPassword } = user;

      logger.info(`Nouvel utilisateur inscrit: ${user.email}`);

      return {
        user: userWithoutPassword,
        tokens,
      };
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        throw new AppError('Email ou mot de passe incorrect', 401);
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new AppError('Email ou mot de passe incorrect', 401);
      }

      // Vérifier si le compte est actif
      if (!user.isActive) {
        throw new AppError('Votre compte a été désactivé', 403);
      }

      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });

      // Générer les tokens
      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
      });

      // Retourner l'utilisateur sans le mot de passe
      const { passwordHash: _, ...userWithoutPassword } = user;

      logger.info(`Utilisateur connecté: ${user.email}`);

      return {
        user: userWithoutPassword,
        tokens,
      };
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * Rafraîchir le token d'accès
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Vérifier le refresh token
      const decoded = verifyRefreshToken(refreshToken);

      if (!decoded) {
        throw new AppError('Refresh token invalide', 401);
      }

      // Vérifier que l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        throw new AppError('Utilisateur non trouvé ou inactif', 401);
      }

      // Générer un nouveau token pair
      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
      });

      return {
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      logger.error('Erreur lors du refresh token:', error);
      throw error;
    }
  }

  /**
   * Connexion avec Google (à implémenter avec Passport)
   */
  static async loginWithGoogle(googleId: string, email: string, profile: any): Promise<LoginResponse> {
    try {
      // Chercher l'utilisateur par Google ID
      let user = await prisma.user.findUnique({
        where: { googleId },
      });

      // Si pas trouvé, chercher par email
      if (!user) {
        user = await prisma.user.findUnique({
          where: { email },
        });

        // Si trouvé, lier le compte Google
        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId },
          });
        }
      }

      // Si toujours pas d'utilisateur, en créer un nouveau
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            googleId,
            firstName: profile.given_name || '',
            lastName: profile.family_name || '',
            username: email.split('@')[0] + Math.random().toString(36).substring(7),
            dateOfBirth: new Date('2000-01-01'), // À compléter lors de l'onboarding
            gender: 'PREFER_NOT_TO_SAY',
            skillLevel: 'BEGINNER',
            preferredPosition: 'BOTH',
            dominantHand: 'RIGHT',
            location: '',
            isVerified: true,
            avatarUrl: profile.picture,
          },
        });

        // Créer les statistiques
        await prisma.userStatistics.create({
          data: { userId: user.id },
        });
      }

      // Générer les tokens
      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
      });

      const { passwordHash: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        tokens,
      };
    } catch (error) {
      logger.error('Erreur lors de la connexion Google:', error);
      throw error;
    }
  }

  /**
   * Demander un reset de mot de passe
   */
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Ne pas révéler si l'email existe ou non
        return;
      }

      // TODO: Générer un token de reset et envoyer un email
      logger.info(`Reset de mot de passe demandé pour: ${email}`);

      // À implémenter: Envoyer un email avec le lien de reset
    } catch (error) {
      logger.error('Erreur lors de la demande de reset:', error);
      throw error;
    }
  }

  /**
   * Réinitialiser le mot de passe
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // TODO: Vérifier le token de reset
      // TODO: Mettre à jour le mot de passe

      logger.info('Mot de passe réinitialisé');
    } catch (error) {
      logger.error('Erreur lors du reset de mot de passe:', error);
      throw error;
    }
  }
}

export default AuthService;
