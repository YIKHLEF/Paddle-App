/**
 * Service de notifications push (Frontend)
 * Utilise Firebase Cloud Messaging (FCM) pour iOS et Android
 */

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import axios from '../api/axios.config';

export interface NotificationData {
  type: string;
  matchId?: string;
  bookingId?: string;
  senderId?: string;
  [key: string]: any;
}

export class NotificationService {
  private static deviceToken: string | null = null;
  private static isInitialized = false;

  /**
   * Initialiser le service de notifications
   * À appeler au démarrage de l'app (une seule fois)
   */
  static async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // 1. Demander la permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('❌ Permission de notifications refusée');
        return false;
      }

      // 2. Créer le canal de notification Android
      if (Platform.OS === 'android') {
        await this.createNotificationChannel();
      }

      // 3. Obtenir le token FCM
      const token = await this.getFCMToken();
      if (!token) {
        console.log('❌ Impossible d\'obtenir le token FCM');
        return false;
      }

      this.deviceToken = token;

      // 4. Enregistrer le token sur le backend
      await this.registerTokenOnBackend(token);

      // 5. Configurer les listeners
      this.setupListeners();

      this.isInitialized = true;
      console.log('✅ Service de notifications initialisé');
      return true;
    } catch (error) {
      console.error('Erreur initialisation notifications:', error);
      return false;
    }
  }

  /**
   * Demander la permission d'envoyer des notifications
   */
  static async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // Android 13+ nécessite une permission runtime
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        // Android < 13: permission accordée automatiquement
        return true;
      }

      // iOS
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error('Erreur demande permission:', error);
      return false;
    }
  }

  /**
   * Vérifier si les notifications sont autorisées
   */
  static async checkPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted;
        }
        return true;
      }

      // iOS
      const authStatus = await messaging().hasPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error('Erreur vérification permission:', error);
      return false;
    }
  }

  /**
   * Obtenir le token FCM
   */
  private static async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Erreur obtention token FCM:', error);
      return null;
    }
  }

  /**
   * Enregistrer le token sur le backend
   */
  private static async registerTokenOnBackend(token: string): Promise<void> {
    try {
      await axios.post('/notifications/register-token', {
        deviceToken: token,
        platform: Platform.OS,
      });
      console.log('✅ Token enregistré sur le backend');
    } catch (error) {
      console.error('Erreur enregistrement token:', error);
    }
  }

  /**
   * Créer le canal de notification Android
   */
  private static async createNotificationChannel(): Promise<void> {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Notifications générales',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.createChannel({
        id: 'matches',
        name: 'Matchs',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.createChannel({
        id: 'messages',
        name: 'Messages',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.createChannel({
        id: 'bookings',
        name: 'Réservations',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    } catch (error) {
      console.error('Erreur création canaux:', error);
    }
  }

  /**
   * Configurer les listeners de notifications
   */
  private static setupListeners(): void {
    // Notification reçue en foreground
    messaging().onMessage(async (remoteMessage) => {
      console.log('Notification reçue en foreground:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    // Notification cliquée (app en background ou fermée)
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification ouverte (background):', remoteMessage);
      this.handleNotificationClick(remoteMessage);
    });

    // Vérifier si l'app a été ouverte via une notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App ouverte via notification:', remoteMessage);
          this.handleNotificationClick(remoteMessage);
        }
      });

    // Token refresh
    messaging().onTokenRefresh(async (token) => {
      console.log('Token FCM rafraîchi:', token);
      this.deviceToken = token;
      await this.registerTokenOnBackend(token);
    });

    // Notifee: gérer les interactions avec les notifications
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressée:', detail);
        this.handleNotificationClick(detail.notification as any);
      }
    });
  }

  /**
   * Afficher une notification locale (quand l'app est ouverte)
   */
  private static async displayNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ): Promise<void> {
    try {
      const { notification, data } = remoteMessage;

      if (!notification) return;

      // Déterminer le canal approprié
      let channelId = 'default';
      if (data?.type === 'match_invitation' || data?.type === 'match_reminder') {
        channelId = 'matches';
      } else if (data?.type === 'new_message') {
        channelId = 'messages';
      } else if (data?.type === 'booking_confirmed' || data?.type === 'booking_cancelled') {
        channelId = 'bookings';
      }

      await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        data: data as Record<string, string>,
        android: {
          channelId,
          smallIcon: 'ic_notification', // Assurez-vous d'avoir cette icône
          pressAction: {
            id: 'default',
          },
          sound: 'default',
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Erreur affichage notification:', error);
    }
  }

  /**
   * Gérer le clic sur une notification
   */
  private static handleNotificationClick(
    notification: FirebaseMessagingTypes.RemoteMessage | any
  ): void {
    const data = notification.data as NotificationData;

    if (!data) return;

    // Utiliser un event emitter ou navigation pour rediriger
    // Exemple: NavigationService.navigate('MatchDetails', { matchId: data.matchId })

    switch (data.type) {
      case 'match_invitation':
      case 'match_reminder':
        if (data.matchId) {
          console.log('Naviguer vers match:', data.matchId);
          // TODO: Navigation vers MatchDetails
        }
        break;

      case 'new_message':
        if (data.senderId) {
          console.log('Naviguer vers conversation:', data.senderId);
          // TODO: Navigation vers Chat
        }
        break;

      case 'booking_confirmed':
      case 'booking_cancelled':
        if (data.bookingId) {
          console.log('Naviguer vers booking:', data.bookingId);
          // TODO: Navigation vers BookingDetails
        }
        break;

      case 'trial_ending':
      case 'payment_failed':
        console.log('Naviguer vers abonnement');
        // TODO: Navigation vers SubscriptionScreen
        break;

      default:
        console.log('Type de notification inconnu:', data.type);
    }
  }

  /**
   * Désactiver les notifications (supprimer le token)
   */
  static async disable(): Promise<boolean> {
    try {
      if (!this.deviceToken) {
        return true;
      }

      // Supprimer le token du backend
      await axios.post('/notifications/unregister-token', {
        deviceToken: this.deviceToken,
      });

      // Supprimer le token local
      await messaging().deleteToken();
      this.deviceToken = null;
      this.isInitialized = false;

      console.log('✅ Notifications désactivées');
      return true;
    } catch (error) {
      console.error('Erreur désactivation notifications:', error);
      return false;
    }
  }

  /**
   * Envoyer une notification de test
   */
  static async sendTestNotification(): Promise<boolean> {
    try {
      const response = await axios.post('/notifications/test');
      return response.data.success;
    } catch (error) {
      console.error('Erreur envoi notification test:', error);
      return false;
    }
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  static async getBadgeCount(): Promise<number> {
    try {
      if (Platform.OS === 'ios') {
        return await notifee.getBadgeCount();
      }
      return 0;
    } catch (error) {
      console.error('Erreur obtention badge count:', error);
      return 0;
    }
  }

  /**
   * Définir le nombre de notifications non lues
   */
  static async setBadgeCount(count: number): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await notifee.setBadgeCount(count);
      }
    } catch (error) {
      console.error('Erreur définition badge count:', error);
    }
  }

  /**
   * Effacer toutes les notifications
   */
  static async clearAllNotifications(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
      await this.setBadgeCount(0);
    } catch (error) {
      console.error('Erreur suppression notifications:', error);
    }
  }
}
