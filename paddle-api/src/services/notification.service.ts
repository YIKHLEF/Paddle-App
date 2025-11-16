/**
 * Service de notifications push
 * Utilise Firebase Cloud Messaging (FCM) via Firebase Admin SDK
 */

import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialiser Firebase Admin (à faire une seule fois au démarrage)
let firebaseInitialized = false;

export const initializeFirebase = () => {
  if (firebaseInitialized) return;

  try {
    // Vérifier si les credentials Firebase sont configurés
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.warn('⚠️ Firebase credentials not configured - push notifications disabled');
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });

    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
};

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface NotificationOptions {
  badge?: number;
  sound?: string;
  priority?: 'high' | 'normal';
  ttl?: number; // Time to live in seconds
}

export class NotificationService {
  /**
   * Enregistrer un token de device pour un utilisateur
   */
  static async registerDeviceToken(
    userId: string,
    deviceToken: string,
    platform: 'ios' | 'android'
  ): Promise<boolean> {
    try {
      // Vérifier si le token existe déjà
      const existingToken = await prisma.deviceToken.findFirst({
        where: { userId, token: deviceToken },
      });

      if (existingToken) {
        // Mettre à jour la date de dernière utilisation
        await prisma.deviceToken.update({
          where: { id: existingToken.id },
          data: { lastUsedAt: new Date() },
        });
        return true;
      }

      // Créer un nouveau token
      await prisma.deviceToken.create({
        data: {
          userId,
          token: deviceToken,
          platform,
          lastUsedAt: new Date(),
        },
      });

      console.log(`✅ Device token registered for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error registering device token:', error);
      return false;
    }
  }

  /**
   * Supprimer un token de device
   */
  static async unregisterDeviceToken(deviceToken: string): Promise<boolean> {
    try {
      await prisma.deviceToken.deleteMany({
        where: { token: deviceToken },
      });
      console.log('✅ Device token unregistered');
      return true;
    } catch (error) {
      console.error('Error unregistering device token:', error);
      return false;
    }
  }

  /**
   * Envoyer une notification à un utilisateur spécifique
   */
  static async sendToUser(
    userId: string,
    notification: NotificationPayload,
    options?: NotificationOptions
  ): Promise<boolean> {
    if (!firebaseInitialized) {
      console.warn('Firebase not initialized - skipping notification');
      return false;
    }

    try {
      // Récupérer tous les tokens de l'utilisateur
      const deviceTokens = await prisma.deviceToken.findMany({
        where: { userId },
      });

      if (deviceTokens.length === 0) {
        console.log(`No device tokens found for user ${userId}`);
        return false;
      }

      const tokens = deviceTokens.map((dt) => dt.token);

      // Envoyer la notification
      const result = await this.sendToTokens(tokens, notification, options);

      // Nettoyer les tokens invalides
      if (result.invalidTokens.length > 0) {
        await prisma.deviceToken.deleteMany({
          where: { token: { in: result.invalidTokens } },
        });
      }

      return result.successCount > 0;
    } catch (error) {
      console.error('Error sending notification to user:', error);
      return false;
    }
  }

  /**
   * Envoyer une notification à plusieurs utilisateurs
   */
  static async sendToUsers(
    userIds: string[],
    notification: NotificationPayload,
    options?: NotificationOptions
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!firebaseInitialized) {
      console.warn('Firebase not initialized - skipping notifications');
      return { successCount: 0, failureCount: userIds.length };
    }

    try {
      // Récupérer tous les tokens des utilisateurs
      const deviceTokens = await prisma.deviceToken.findMany({
        where: { userId: { in: userIds } },
      });

      if (deviceTokens.length === 0) {
        return { successCount: 0, failureCount: userIds.length };
      }

      const tokens = deviceTokens.map((dt) => dt.token);
      const result = await this.sendToTokens(tokens, notification, options);

      // Nettoyer les tokens invalides
      if (result.invalidTokens.length > 0) {
        await prisma.deviceToken.deleteMany({
          where: { token: { in: result.invalidTokens } },
        });
      }

      return {
        successCount: result.successCount,
        failureCount: result.failureCount,
      };
    } catch (error) {
      console.error('Error sending notifications to users:', error);
      return { successCount: 0, failureCount: userIds.length };
    }
  }

  /**
   * Envoyer une notification à des tokens spécifiques
   */
  private static async sendToTokens(
    tokens: string[],
    notification: NotificationPayload,
    options?: NotificationOptions
  ): Promise<{
    successCount: number;
    failureCount: number;
    invalidTokens: string[];
  }> {
    if (!firebaseInitialized) {
      throw new Error('Firebase not initialized');
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl,
        },
        data: notification.data,
        tokens,
        android: {
          priority: options?.priority || 'high',
          ttl: options?.ttl ? options.ttl * 1000 : undefined,
          notification: {
            sound: options?.sound || 'default',
            priority: options?.priority || 'high',
          },
        },
        apns: {
          payload: {
            aps: {
              badge: options?.badge,
              sound: options?.sound || 'default',
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      // Identifier les tokens invalides
      const invalidTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(tokens[idx]);
          }
        }
      });

      console.log(
        `📨 Notifications sent: ${response.successCount} success, ${response.failureCount} failures`
      );

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
      };
    } catch (error) {
      console.error('Error sending FCM notifications:', error);
      return {
        successCount: 0,
        failureCount: tokens.length,
        invalidTokens: [],
      };
    }
  }

  /**
   * Envoyer une notification de nouveau message
   */
  static async sendNewMessageNotification(
    recipientId: string,
    senderName: string,
    messagePreview: string
  ): Promise<boolean> {
    return this.sendToUser(recipientId, {
      title: `Nouveau message de ${senderName}`,
      body: messagePreview,
      data: {
        type: 'new_message',
        senderId: recipientId,
      },
    });
  }

  /**
   * Envoyer une notification d'invitation à un match
   */
  static async sendMatchInvitationNotification(
    recipientId: string,
    matchTitle: string,
    organizerName: string,
    matchId: string
  ): Promise<boolean> {
    return this.sendToUser(recipientId, {
      title: 'Invitation à un match',
      body: `${organizerName} vous invite à rejoindre "${matchTitle}"`,
      data: {
        type: 'match_invitation',
        matchId,
      },
    });
  }

  /**
   * Envoyer une notification de rappel de match
   */
  static async sendMatchReminderNotification(
    userId: string,
    matchTitle: string,
    matchTime: string,
    matchId: string
  ): Promise<boolean> {
    return this.sendToUser(userId, {
      title: 'Rappel de match',
      body: `Votre match "${matchTitle}" commence dans 1 heure (${matchTime})`,
      data: {
        type: 'match_reminder',
        matchId,
      },
    });
  }

  /**
   * Envoyer une notification de confirmation de réservation
   */
  static async sendBookingConfirmationNotification(
    userId: string,
    courtName: string,
    dateTime: string,
    bookingId: string
  ): Promise<boolean> {
    return this.sendToUser(userId, {
      title: 'Réservation confirmée',
      body: `Votre terrain "${courtName}" est réservé pour ${dateTime}`,
      data: {
        type: 'booking_confirmed',
        bookingId,
      },
    });
  }

  /**
   * Envoyer une notification d'annulation de réservation
   */
  static async sendBookingCancellationNotification(
    userId: string,
    courtName: string,
    dateTime: string
  ): Promise<boolean> {
    return this.sendToUser(userId, {
      title: 'Réservation annulée',
      body: `Votre réservation pour "${courtName}" (${dateTime}) a été annulée`,
      data: {
        type: 'booking_cancelled',
      },
    });
  }

  /**
   * Envoyer une notification de fin d'essai gratuit
   */
  static async sendTrialEndingNotification(
    userId: string,
    daysRemaining: number
  ): Promise<boolean> {
    return this.sendToUser(userId, {
      title: 'Fin de votre essai gratuit',
      body: `Votre essai gratuit se termine dans ${daysRemaining} jour${
        daysRemaining > 1 ? 's' : ''
      }`,
      data: {
        type: 'trial_ending',
      },
    });
  }

  /**
   * Envoyer une notification de paiement réussi
   */
  static async sendPaymentSuccessNotification(
    userId: string,
    amount: number,
    planName: string
  ): Promise<boolean> {
    return this.sendToUser(userId, {
      title: 'Paiement réussi',
      body: `Votre abonnement ${planName} a été renouvelé (${amount}€)`,
      data: {
        type: 'payment_success',
      },
    });
  }

  /**
   * Envoyer une notification d'échec de paiement
   */
  static async sendPaymentFailureNotification(
    userId: string,
    planName: string
  ): Promise<boolean> {
    return this.sendToUser(userId, {
      title: 'Échec du paiement',
      body: `Le renouvellement de votre abonnement ${planName} a échoué. Veuillez mettre à jour vos informations de paiement.`,
      data: {
        type: 'payment_failed',
      },
    });
  }
}
