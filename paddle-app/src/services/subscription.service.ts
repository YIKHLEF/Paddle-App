/**
 * Service de gestion des abonnements
 * Utilise react-native-iap pour iOS (StoreKit) et Android (Google Play Billing)
 */

import * as RNIap from 'react-native-iap';
import { Platform, Alert } from 'react-native';
import axios from '../api/axios.config';

// IDs des produits (à configurer dans App Store Connect et Google Play Console)
export const SUBSCRIPTION_SKUS = {
  STANDARD_MONTHLY: Platform.select({
    ios: 'com.paddleapp.standard.monthly',
    android: 'paddle_standard_monthly',
  })!,
  PREMIUM_MONTHLY: Platform.select({
    ios: 'com.paddleapp.premium.monthly',
    android: 'paddle_premium_monthly',
  })!,
  PREMIUM_ANNUAL: Platform.select({
    ios: 'com.paddleapp.premium.annual',
    android: 'paddle_premium_annual',
  })!,
};

export interface SubscriptionProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  localizedPrice: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  tier: 'FREE' | 'STANDARD' | 'PREMIUM';
  expiryDate: Date | null;
  isTrialActive: boolean;
  trialEndDate: Date | null;
}

export class SubscriptionService {
  private static purchaseUpdateSubscription: any = null;
  private static purchaseErrorSubscription: any = null;

  /**
   * Initialiser le service IAP
   */
  static async initialize(): Promise<boolean> {
    try {
      // Se connecter au store
      const connected = await RNIap.initConnection();

      if (!connected) {
        console.error('Impossible de se connecter au store');
        return false;
      }

      // Écouter les mises à jour des achats
      this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async (purchase) => {
          console.log('Achat mis à jour:', purchase);
          await this.handlePurchaseUpdate(purchase);
        }
      );

      // Écouter les erreurs d'achat
      this.purchaseErrorSubscription = RNIap.purchaseErrorListener(
        (error) => {
          console.warn('Erreur achat:', error);
          Alert.alert(
            'Erreur',
            'Une erreur est survenue lors de l\'achat. Veuillez réessayer.'
          );
        }
      );

      console.log('✅ IAP initialisé');
      return true;
    } catch (error) {
      console.error('Erreur initialisation IAP:', error);
      return false;
    }
  }

  /**
   * Déconnecter le service IAP
   */
  static async disconnect(): Promise<void> {
    try {
      if (this.purchaseUpdateSubscription) {
        this.purchaseUpdateSubscription.remove();
        this.purchaseUpdateSubscription = null;
      }
      if (this.purchaseErrorSubscription) {
        this.purchaseErrorSubscription.remove();
        this.purchaseErrorSubscription = null;
      }
      await RNIap.endConnection();
      console.log('IAP déconnecté');
    } catch (error) {
      console.error('Erreur déconnexion IAP:', error);
    }
  }

  /**
   * Récupérer les produits disponibles
   */
  static async getProducts(): Promise<SubscriptionProduct[]> {
    try {
      const skus = Object.values(SUBSCRIPTION_SKUS);
      const products = await RNIap.getSubscriptions({ skus });

      return products.map((product) => ({
        productId: product.productId,
        title: product.title || 'Abonnement',
        description: product.description || '',
        price: product.price || '0',
        currency: product.currency || 'EUR',
        localizedPrice: product.localizedPrice || '0€',
      }));
    } catch (error) {
      console.error('Erreur récupération produits:', error);
      return [];
    }
  }

  /**
   * Acheter un abonnement
   */
  static async purchaseSubscription(
    productId: string,
    offerId?: string
  ): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur peut faire des achats
      const canMakePayments = await RNIap.getAvailablePurchases();

      await RNIap.requestSubscription({
        sku: productId,
        ...(Platform.OS === 'android' &&
          offerId && { subscriptionOffers: [{ sku: productId, offerToken: offerId }] }),
      });

      return true;
    } catch (error: any) {
      console.error('Erreur achat abonnement:', error);

      if (error.code === 'E_USER_CANCELLED') {
        // L'utilisateur a annulé
        return false;
      }

      Alert.alert(
        'Erreur',
        'Impossible de finaliser l\'achat. Veuillez réessayer.'
      );
      return false;
    }
  }

  /**
   * Gérer la mise à jour d'un achat
   */
  private static async handlePurchaseUpdate(purchase: RNIap.Purchase): Promise<void> {
    try {
      const { productId, transactionReceipt, purchaseToken } = purchase;

      // Vérifier le reçu auprès du backend
      const response = await axios.post('/subscriptions/verify-purchase', {
        productId,
        receipt: Platform.OS === 'ios' ? transactionReceipt : purchaseToken,
        platform: Platform.OS,
      });

      if (response.data.success) {
        // Finaliser la transaction
        if (Platform.OS === 'ios') {
          await RNIap.finishTransaction({ purchase, isConsumable: false });
        } else {
          // Android: acknowledge purchase
          await RNIap.acknowledgePurchaseAndroid({ token: purchaseToken!, developerPayload: '' });
        }

        Alert.alert(
          'Succès !',
          'Votre abonnement a été activé avec succès.'
        );
      } else {
        throw new Error('Vérification du reçu échouée');
      }
    } catch (error) {
      console.error('Erreur traitement achat:', error);
      Alert.alert(
        'Erreur',
        'Impossible de vérifier votre achat. Contactez le support.'
      );
    }
  }

  /**
   * Restaurer les achats (important pour iOS)
   */
  static async restorePurchases(): Promise<boolean> {
    try {
      const purchases = await RNIap.getAvailablePurchases();

      if (purchases.length === 0) {
        Alert.alert(
          'Aucun achat',
          'Aucun achat précédent trouvé.'
        );
        return false;
      }

      // Envoyer au backend pour restaurer
      const response = await axios.post('/subscriptions/restore', {
        purchases,
        platform: Platform.OS,
      });

      if (response.data.success) {
        Alert.alert(
          'Restauré !',
          'Vos achats ont été restaurés avec succès.'
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur restauration achats:', error);
      Alert.alert(
        'Erreur',
        'Impossible de restaurer vos achats.'
      );
      return false;
    }
  }

  /**
   * Annuler un abonnement (redirection vers les paramètres du store)
   */
  static async cancelSubscription(): Promise<void> {
    const title = 'Annuler l\'abonnement';
    const message = Platform.select({
      ios: 'Pour annuler votre abonnement, allez dans Réglages > Votre nom > Abonnements.',
      android: 'Pour annuler votre abonnement, allez dans Google Play Store > Abonnements.',
    });

    Alert.alert(title, message, [
      { text: 'OK', style: 'cancel' },
      {
        text: 'Ouvrir les paramètres',
        onPress: () => {
          if (Platform.OS === 'ios') {
            RNIap.deepLinkToSubscriptions();
          } else {
            // Android: ouvrir Google Play
            RNIap.deepLinkToSubscriptions();
          }
        },
      },
    ]);
  }

  /**
   * Vérifier le statut de l'abonnement
   */
  static async checkSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await axios.get('/subscriptions/status');

      return {
        isSubscribed: response.data.isSubscribed,
        tier: response.data.tier,
        expiryDate: response.data.expiryDate
          ? new Date(response.data.expiryDate)
          : null,
        isTrialActive: response.data.isTrialActive || false,
        trialEndDate: response.data.trialEndDate
          ? new Date(response.data.trialEndDate)
          : null,
      };
    } catch (error) {
      console.error('Erreur vérification statut abonnement:', error);
      return {
        isSubscribed: false,
        tier: 'FREE',
        expiryDate: null,
        isTrialActive: false,
        trialEndDate: null,
      };
    }
  }

  /**
   * Démarrer un essai gratuit
   */
  static async startFreeTrial(productId: string): Promise<boolean> {
    try {
      // L'essai gratuit est géré automatiquement par le store
      // Il faut juste s'assurer que le produit a une offre trial
      return await this.purchaseSubscription(productId);
    } catch (error) {
      console.error('Erreur démarrage essai:', error);
      return false;
    }
  }
}
