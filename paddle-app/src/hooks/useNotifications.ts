/**
 * Hook pour les notifications push
 * Simplifie l'utilisation du NotificationService dans les composants
 */

import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@/services/notification.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleNotifications } from '@/store/slices/appSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notificationsEnabled = useAppSelector((state) => state.app.notificationsEnabled);

  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);

  /**
   * Vérifier l'état des permissions au montage
   */
  useEffect(() => {
    checkPermission();
    updateBadgeCount();
  }, []);

  /**
   * Initialiser le service si les notifications sont activées
   */
  useEffect(() => {
    if (notificationsEnabled && !isInitialized) {
      initializeNotifications();
    }
  }, [notificationsEnabled]);

  /**
   * Vérifier si les permissions sont accordées
   */
  const checkPermission = useCallback(async () => {
    const granted = await NotificationService.checkPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  /**
   * Demander la permission pour les notifications
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const granted = await NotificationService.requestPermission();
      setHasPermission(granted);

      if (granted) {
        // Activer automatiquement dans Redux
        dispatch(toggleNotifications());
      }

      return granted;
    } catch (error) {
      console.error('Erreur demande permission:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Initialiser le service de notifications
   */
  const initializeNotifications = useCallback(async (): Promise<boolean> => {
    if (isInitialized) return true;

    setLoading(true);
    try {
      const success = await NotificationService.initialize();
      setIsInitialized(success);

      if (success) {
        setHasPermission(true);
      }

      return success;
    } catch (error) {
      console.error('Erreur initialisation notifications:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  /**
   * Activer les notifications
   */
  const enable = useCallback(async (): Promise<boolean> => {
    // D'abord demander la permission si pas encore accordée
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    // Ensuite initialiser le service
    const success = await initializeNotifications();

    if (success) {
      dispatch(toggleNotifications());
    }

    return success;
  }, [hasPermission, requestPermission, initializeNotifications, dispatch]);

  /**
   * Désactiver les notifications
   */
  const disable = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await NotificationService.disable();

      if (success) {
        setIsInitialized(false);
        dispatch(toggleNotifications());
      }

      return success;
    } catch (error) {
      console.error('Erreur désactivation notifications:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Envoyer une notification de test
   */
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!isInitialized || !hasPermission) {
      console.warn('Notifications pas initialisées ou permission manquante');
      return false;
    }

    setLoading(true);
    try {
      return await NotificationService.sendTestNotification();
    } catch (error) {
      console.error('Erreur envoi notification test:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isInitialized, hasPermission]);

  /**
   * Mettre à jour le badge count
   */
  const updateBadgeCount = useCallback(async () => {
    try {
      const count = await NotificationService.getBadgeCount();
      setBadgeCount(count);
    } catch (error) {
      console.error('Erreur récupération badge count:', error);
    }
  }, []);

  /**
   * Définir le badge count
   */
  const setNotificationBadge = useCallback(async (count: number) => {
    try {
      await NotificationService.setBadgeCount(count);
      setBadgeCount(count);
    } catch (error) {
      console.error('Erreur définition badge count:', error);
    }
  }, []);

  /**
   * Effacer toutes les notifications
   */
  const clearAll = useCallback(async () => {
    try {
      await NotificationService.clearAllNotifications();
      setBadgeCount(0);
    } catch (error) {
      console.error('Erreur suppression notifications:', error);
    }
  }, []);

  /**
   * Toggle les notifications (activer/désactiver)
   */
  const toggle = useCallback(async (): Promise<boolean> => {
    if (notificationsEnabled) {
      return await disable();
    } else {
      return await enable();
    }
  }, [notificationsEnabled, enable, disable]);

  return {
    // État
    isInitialized,
    hasPermission,
    notificationsEnabled,
    loading,
    badgeCount,

    // Méthodes
    checkPermission,
    requestPermission,
    enable,
    disable,
    toggle,
    sendTestNotification,
    updateBadgeCount,
    setNotificationBadge,
    clearAll,
  };
};
