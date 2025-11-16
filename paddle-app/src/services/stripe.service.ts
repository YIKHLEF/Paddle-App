/**
 * Service Stripe Frontend
 * Gère les paiements via Stripe avec @stripe/stripe-react-native
 */

import { initPaymentSheet, presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import axios from '../api/axios.config';

export interface SubscriptionPrice {
  id: string;
  productName: string;
  currency: string;
  amount: number; // en cents
  interval: 'month' | 'year';
  trialDays: number;
}

export interface CreateSubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  error?: string;
}

export class StripePaymentService {
  /**
   * Initialiser le Payment Sheet pour une souscription
   */
  static async initializePaymentSheet(
    priceId: string,
    trialDays: number = 14
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Créer la souscription côté backend et récupérer le clientSecret
      const response = await axios.post('/subscriptions/create', {
        priceId,
        trialDays,
      });

      const { clientSecret, subscriptionId } = response.data.data;

      if (!clientSecret) {
        throw new Error('Client secret non reçu');
      }

      // Initialiser le Payment Sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Paddle App',
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        returnURL: 'paddle-app://stripe-redirect',
      });

      if (error) {
        console.error('Erreur init payment sheet:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erreur initialisation paiement:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'initialisation',
      };
    }
  }

  /**
   * Présenter le Payment Sheet à l'utilisateur
   */
  static async presentPaymentSheet(): Promise<CreateSubscriptionResult> {
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error('Erreur présentation payment sheet:', error);

        if (error.code === 'Canceled') {
          return {
            success: false,
            error: 'Paiement annulé',
          };
        }

        return {
          success: false,
          error: error.message,
        };
      }

      // Paiement réussi
      return { success: true };
    } catch (error: any) {
      console.error('Erreur paiement:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du paiement',
      };
    }
  }

  /**
   * Flow complet de souscription
   */
  static async subscribe(
    priceId: string,
    trialDays: number = 14
  ): Promise<CreateSubscriptionResult> {
    try {
      // 1. Initialiser le Payment Sheet
      const initResult = await this.initializePaymentSheet(priceId, trialDays);

      if (!initResult.success) {
        return initResult;
      }

      // 2. Présenter le Payment Sheet
      const paymentResult = await this.presentPaymentSheet();

      return paymentResult;
    } catch (error: any) {
      console.error('Erreur souscription:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la souscription',
      };
    }
  }

  /**
   * Récupérer les prix disponibles
   */
  static async getPrices(): Promise<SubscriptionPrice[]> {
    try {
      const response = await axios.get('/subscriptions/prices');

      return response.data.data.map((price: any) => ({
        id: price.id,
        productName:
          typeof price.product === 'string' ? price.product : price.product.name,
        currency: price.currency.toUpperCase(),
        amount: price.unitAmount,
        interval: price.recurring?.interval || 'month',
        trialDays: price.recurring?.trial_period_days || 0,
      }));
    } catch (error) {
      console.error('Erreur récupération prix:', error);
      return [];
    }
  }

  /**
   * Annuler une souscription
   */
  static async cancelSubscription(
    subscriptionId: string,
    immediate: boolean = false
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.post('/subscriptions/cancel', {
        subscriptionId,
        immediate,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erreur annulation:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'annulation',
      };
    }
  }

  /**
   * Créer une session Checkout (web)
   */
  static async createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await axios.post('/subscriptions/checkout-session', {
        priceId,
        successUrl,
        cancelUrl,
      });

      return {
        success: true,
        url: response.data.data.url,
      };
    } catch (error: any) {
      console.error('Erreur checkout session:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création de la session',
      };
    }
  }

  /**
   * Ouvrir le Customer Portal
   */
  static async openCustomerPortal(
    returnUrl: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await axios.post('/subscriptions/portal', {
        returnUrl,
      });

      return {
        success: true,
        url: response.data.data.url,
      };
    } catch (error: any) {
      console.error('Erreur portal:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'ouverture du portail',
      };
    }
  }

  /**
   * Mettre à jour une souscription (upgrade/downgrade)
   */
  static async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.put('/subscriptions/update', {
        subscriptionId,
        newPriceId,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erreur mise à jour:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour',
      };
    }
  }
}
