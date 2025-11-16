/**
 * Hook pour gérer les abonnements
 * Simplifie l'utilisation du service d'abonnement dans les composants
 */

import { useState, useEffect, useCallback } from 'react';
import {
  SubscriptionService,
  SubscriptionProduct,
  SubscriptionStatus,
  SUBSCRIPTION_SKUS,
} from '@/services/subscription.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSubscription } from '@/store/slices/authSlice';

export const useSubscription = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    tier: 'FREE',
    expiryDate: null,
    isTrialActive: false,
    trialEndDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  /**
   * Charger les produits et le statut au montage
   */
  useEffect(() => {
    initializeSubscription();

    return () => {
      // Cleanup lors du démontage
      SubscriptionService.disconnect();
    };
  }, []);

  /**
   * Initialiser le service d'abonnement
   */
  const initializeSubscription = useCallback(async () => {
    setLoading(true);
    try {
      // Initialiser IAP
      const initialized = await SubscriptionService.initialize();

      if (!initialized) {
        console.error('Échec initialisation IAP');
        setLoading(false);
        return;
      }

      // Charger les produits
      const availableProducts = await SubscriptionService.getProducts();
      setProducts(availableProducts);

      // Charger le statut
      const currentStatus = await SubscriptionService.checkSubscriptionStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('Erreur initialisation abonnement:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Acheter un abonnement
   */
  const subscribe = useCallback(
    async (productId: string): Promise<boolean> => {
      setPurchasing(true);
      try {
        const success = await SubscriptionService.purchaseSubscription(productId);

        if (success) {
          // Rafraîchir le statut
          const newStatus = await SubscriptionService.checkSubscriptionStatus();
          setStatus(newStatus);

          // Mettre à jour Redux
          dispatch(
            updateSubscription({
              tier: newStatus.tier,
              expiryDate: newStatus.expiryDate?.toISOString() || null,
            })
          );
        }

        return success;
      } catch (error) {
        console.error('Erreur souscription:', error);
        return false;
      } finally {
        setPurchasing(false);
      }
    },
    [dispatch]
  );

  /**
   * Restaurer les achats
   */
  const restore = useCallback(async (): Promise<boolean> => {
    setPurchasing(true);
    try {
      const success = await SubscriptionService.restorePurchases();

      if (success) {
        // Rafraîchir le statut
        const newStatus = await SubscriptionService.checkSubscriptionStatus();
        setStatus(newStatus);
      }

      return success;
    } catch (error) {
      console.error('Erreur restauration:', error);
      return false;
    } finally {
      setPurchasing(false);
    }
  }, []);

  /**
   * Annuler l'abonnement
   */
  const cancel = useCallback(async (): Promise<void> => {
    await SubscriptionService.cancelSubscription();
  }, []);

  /**
   * Démarrer l'essai gratuit
   */
  const startTrial = useCallback(
    async (tier: 'STANDARD' | 'PREMIUM'): Promise<boolean> => {
      const productId =
        tier === 'STANDARD'
          ? SUBSCRIPTION_SKUS.STANDARD_MONTHLY
          : SUBSCRIPTION_SKUS.PREMIUM_MONTHLY;

      return await subscribe(productId);
    },
    [subscribe]
  );

  /**
   * Vérifier si un upgrade est disponible
   */
  const canUpgrade = useCallback((): boolean => {
    return status.tier === 'FREE' || status.tier === 'STANDARD';
  }, [status.tier]);

  /**
   * Obtenir le prix d'un produit
   */
  const getProductPrice = useCallback(
    (productId: string): string | null => {
      const product = products.find((p) => p.productId === productId);
      return product?.localizedPrice || null;
    },
    [products]
  );

  return {
    // État
    products,
    status,
    loading,
    purchasing,
    isSubscribed: status.isSubscribed,
    tier: status.tier,
    expiryDate: status.expiryDate,
    isTrialActive: status.isTrialActive,
    trialEndDate: status.trialEndDate,

    // Méthodes
    subscribe,
    restore,
    cancel,
    startTrial,
    canUpgrade,
    getProductPrice,
    refresh: initializeSubscription,
  };
};
