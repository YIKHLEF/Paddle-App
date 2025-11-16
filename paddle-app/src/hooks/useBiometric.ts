/**
 * Hook pour l'authentification biométrique
 * Usage simplifié dans les composants React
 */

import { useState, useEffect, useCallback } from 'react';
import { BiometricService, BiometricAvailability } from '@/services/biometric.service';

export const useBiometric = () => {
  const [availability, setAvailability] = useState<BiometricAvailability>({
    available: false,
    biometryType: null,
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Vérifier la disponibilité au montage du composant
   */
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  /**
   * Vérifier si la biométrie est disponible et activée
   */
  const checkBiometricAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const result = await BiometricService.checkAvailability();
      setAvailability(result);

      if (result.available) {
        const enabled = await BiometricService.isBiometricEnabled();
        setIsEnabled(enabled);
      }
    } catch (error) {
      console.error('Erreur vérification biométrie:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Authentifier avec biométrie
   */
  const authenticate = useCallback(
    async (promptMessage?: string): Promise<boolean> => {
      const result = await BiometricService.authenticate(promptMessage);
      return result.success;
    },
    []
  );

  /**
   * Activer la biométrie
   */
  const enable = useCallback(async (): Promise<boolean> => {
    const success = await BiometricService.enableBiometric();
    if (success) {
      setIsEnabled(true);
    }
    return success;
  }, []);

  /**
   * Désactiver la biométrie
   */
  const disable = useCallback(async (): Promise<void> => {
    await BiometricService.disableBiometric();
    setIsEnabled(false);
  }, []);

  /**
   * Obtenir le nom de la biométrie (Face ID, Touch ID, etc.)
   */
  const getBiometricName = useCallback((): string => {
    return BiometricService.getBiometricName(availability.biometryType);
  }, [availability.biometryType]);

  return {
    // État
    availability,
    isAvailable: availability.available,
    biometryType: availability.biometryType,
    isEnabled,
    loading,

    // Méthodes
    authenticate,
    enable,
    disable,
    checkAvailability: checkBiometricAvailability,
    getBiometricName,
  };
};
