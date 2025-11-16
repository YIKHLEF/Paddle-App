/**
 * OAuth Service - Gestion de l'authentification sociale
 * Supporte: Google, Apple, Facebook
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleTokenPayload {
  sub: string; // Google User ID
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface AppleTokenPayload {
  sub: string; // Apple User ID
  email: string;
  email_verified: boolean;
}

interface FacebookUserData {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export class OAuthService {
  /**
   * Authentification avec Google
   */
  static async loginWithGoogle(idToken: string) {
    try {
      // Vérifier le token Google
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload() as GoogleTokenPayload;

      if (!payload || !payload.email_verified) {
        throw new Error('Email non vérifié par Google');
      }

      // Chercher ou créer l'utilisateur
      let user = await prisma.user.findUnique({
        where: { googleId: payload.sub },
        include: { statistics: true },
      });

      if (!user) {
        // Vérifier si un utilisateur existe avec cet email
        const existingUser = await prisma.user.findUnique({
          where: { email: payload.email },
        });

        if (existingUser) {
          // Lier le compte Google à l'utilisateur existant
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: payload.sub,
              isVerified: true,
              avatarUrl: payload.picture || existingUser.avatarUrl,
            },
            include: { statistics: true },
          });
        } else {
          // Créer un nouveau utilisateur
          user = await prisma.user.create({
            data: {
              email: payload.email,
              googleId: payload.sub,
              firstName: payload.given_name,
              lastName: payload.family_name,
              username: await this.generateUniqueUsername(payload.email),
              avatarUrl: payload.picture,
              isVerified: true,
              // Valeurs par défaut - à compléter lors de l'onboarding
              dateOfBirth: new Date('2000-01-01'),
              gender: 'PREFER_NOT_TO_SAY',
              skillLevel: 'BEGINNER',
              preferredPosition: 'BOTH',
              dominantHand: 'RIGHT',
              location: '',
              statistics: {
                create: {},
              },
            },
            include: { statistics: true },
          });
        }
      }

      // Générer les tokens JWT
      const tokens = this.generateTokens(user.id);

      return {
        user: this.sanitizeUser(user),
        tokens,
      };
    } catch (error) {
      console.error('Erreur login Google:', error);
      throw new Error('Échec de l\'authentification Google');
    }
  }

  /**
   * Authentification avec Apple
   */
  static async loginWithApple(identityToken: string, user?: { firstName: string; lastName: string }) {
    try {
      // Décoder le JWT Apple (sans vérification pour l'exemple, à sécuriser en prod)
      const decoded = jwt.decode(identityToken) as AppleTokenPayload;

      if (!decoded || !decoded.email) {
        throw new Error('Token Apple invalide');
      }

      // Chercher ou créer l'utilisateur
      let dbUser = await prisma.user.findUnique({
        where: { appleId: decoded.sub },
        include: { statistics: true },
      });

      if (!dbUser) {
        const existingUser = await prisma.user.findUnique({
          where: { email: decoded.email },
        });

        if (existingUser) {
          // Lier le compte Apple
          dbUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              appleId: decoded.sub,
              isVerified: true,
            },
            include: { statistics: true },
          });
        } else {
          // Créer nouveau compte
          dbUser = await prisma.user.create({
            data: {
              email: decoded.email,
              appleId: decoded.sub,
              firstName: user?.firstName || 'User',
              lastName: user?.lastName || 'Apple',
              username: await this.generateUniqueUsername(decoded.email),
              isVerified: true,
              dateOfBirth: new Date('2000-01-01'),
              gender: 'PREFER_NOT_TO_SAY',
              skillLevel: 'BEGINNER',
              preferredPosition: 'BOTH',
              dominantHand: 'RIGHT',
              location: '',
              statistics: {
                create: {},
              },
            },
            include: { statistics: true },
          });
        }
      }

      const tokens = this.generateTokens(dbUser.id);

      return {
        user: this.sanitizeUser(dbUser),
        tokens,
      };
    } catch (error) {
      console.error('Erreur login Apple:', error);
      throw new Error('Échec de l\'authentification Apple');
    }
  }

  /**
   * Authentification avec Facebook
   */
  static async loginWithFacebook(accessToken: string) {
    try {
      // Vérifier le token Facebook et récupérer les données utilisateur
      const response = await axios.get<FacebookUserData>(
        `https://graph.facebook.com/me?fields=id,email,name,first_name,last_name,picture&access_token=${accessToken}`
      );

      const fbUser = response.data;

      if (!fbUser.email) {
        throw new Error('Email non fourni par Facebook');
      }

      // Chercher ou créer l'utilisateur
      let user = await prisma.user.findUnique({
        where: { facebookId: fbUser.id },
        include: { statistics: true },
      });

      if (!user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: fbUser.email },
        });

        if (existingUser) {
          // Lier le compte Facebook
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              facebookId: fbUser.id,
              isVerified: true,
              avatarUrl: fbUser.picture?.data?.url || existingUser.avatarUrl,
            },
            include: { statistics: true },
          });
        } else {
          // Créer nouveau compte
          user = await prisma.user.create({
            data: {
              email: fbUser.email,
              facebookId: fbUser.id,
              firstName: fbUser.first_name,
              lastName: fbUser.last_name,
              username: await this.generateUniqueUsername(fbUser.email),
              avatarUrl: fbUser.picture?.data?.url,
              isVerified: true,
              dateOfBirth: new Date('2000-01-01'),
              gender: 'PREFER_NOT_TO_SAY',
              skillLevel: 'BEGINNER',
              preferredPosition: 'BOTH',
              dominantHand: 'RIGHT',
              location: '',
              statistics: {
                create: {},
              },
            },
            include: { statistics: true },
          });
        }
      }

      const tokens = this.generateTokens(user.id);

      return {
        user: this.sanitizeUser(user),
        tokens,
      };
    } catch (error) {
      console.error('Erreur login Facebook:', error);
      throw new Error('Échec de l\'authentification Facebook');
    }
  }

  /**
   * Générer un username unique à partir de l'email
   */
  private static async generateUniqueUsername(email: string): Promise<string> {
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let counter = 1;

    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }

  /**
   * Générer les tokens JWT (access + refresh)
   */
  private static generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Nettoyer les données utilisateur (retirer le password hash)
   */
  private static sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
