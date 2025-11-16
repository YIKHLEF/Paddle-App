/**
 * Service d'authentification biométrique
 * Gère Face ID (iOS) et Touch ID / Fingerprint (iOS/Android)
 */

import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

// Clé pour stocker la préférence biométrique
const BIOMETRIC_ENABLED_KEY = 'biometric_auth_enabled';

export interface BiometricAvailability {
  available: boolean;
  biometryType: BiometryType | null;
  error?: string;
}

export class BiometricService {
  /**
   * Vérifier si la biométrie est disponible sur l'appareil
   */
  static async checkAvailability(): Promise<BiometricAvailability> {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      return {
        available,
        biometryType: biometryType || null,
      };
    } catch (error: any) {
      console.error('Erreur vérification biométrie:', error);
      return {
        available: false,
        biometryType: null,
        error: error.message,
      };
    }
  }

  /**
   * Récupérer le nom de la biométrie selon le type
   */
  static getBiometricName(biometryType: BiometryType | null): string {
    switch (biometryType) {
      case BiometryType.FaceID:
        return 'Face ID';
      case BiometryType.TouchID:
        return 'Touch ID';
      case BiometryType.Biometrics:
        return Platform.OS === 'android' ? 'Empreinte digitale' : 'Biométrie';
      default:
        return 'Biométrie';
    }
  }

  /**
   * Authentifier l'utilisateur avec la biométrie
   */
  static async authenticate(promptMessage?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Vérifier disponibilité
      const availability = await this.checkAvailability();

      if (!availability.available) {
        return {
          success: false,
          error: 'Authentification biométrique non disponible sur cet appareil',
        };
      }

      const biometricName = this.getBiometricName(availability.biometryType);

      // Prompt de biométrie
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage:
          promptMessage ||
          `Utilisez ${biometricName} pour vous connecter`,
        cancelButtonText: 'Annuler',
      });

      return { success };
    } catch (error: any) {
      console.error('Erreur authentification biométrique:', error);

      let errorMessage = 'Échec de l\'authentification biométrique';

      // Gestion des erreurs spécifiques
      if (error.message?.includes('cancelled') || error.message?.includes('canceled')) {
        errorMessage = 'Authentification annulée';
      } else if (error.message?.includes('lockout')) {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
      } else if (error.message?.includes('not enrolled')) {
        errorMessage = 'Aucune biométrie configurée sur cet appareil';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Activer l'authentification biométrique pour l'app
   */
  static async enableBiometric(): Promise<boolean> {
    try {
      // Tester d'abord la biométrie
      const result = await this.authenticate('Confirmez pour activer la connexion biométrique');

      if (result.success) {
        await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur activation biométrie:', error);
      return false;
    }
  }

  /**
   * Désactiver l'authentification biométrique
   */
  static async disableBiometric(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    } catch (error) {
      console.error('Erreur désactivation biométrie:', error);
    }
  }

  /**
   * Vérifier si la biométrie est activée
   */
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Erreur lecture préférence biométrie:', error);
      return false;
    }
  }

  /**
   * Créer une clé de signature (pour des features avancées)
   */
  static async createKeys(): Promise<{ publicKey: string } | null> {
    try {
      const { publicKey } = await rnBiometrics.createKeys();
      return { publicKey };
    } catch (error) {
      console.error('Erreur création clés biométriques:', error);
      return null;
    }
  }

  /**
   * Supprimer les clés biométriques
   */
  static async deleteKeys(): Promise<boolean> {
    try {
      const { keysDeleted } = await rnBiometrics.deleteKeys();
      return keysDeleted;
    } catch (error) {
      console.error('Erreur suppression clés biométriques:', error);
      return false;
    }
  }

  /**
   * Prompt avec option de fallback sur mot de passe
   */
  static async authenticateWithFallback(
    onBiometricFail: () => void
  ): Promise<{ success: boolean; usedBiometric: boolean }> {
    const availability = await this.checkAvailability();

    if (!availability.available) {
      // Pas de biométrie disponible, fallback direct
      onBiometricFail();
      return { success: false, usedBiometric: false };
    }

    const result = await this.authenticate();

    if (!result.success) {
      // Biométrie a échoué, proposer le fallback
      Alert.alert(
        'Authentification échouée',
        'Voulez-vous vous connecter avec votre mot de passe ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Mot de passe',
            onPress: () => onBiometricFail(),
          },
        ]
      );
      return { success: false, usedBiometric: false };
    }

    return { success: true, usedBiometric: true };
  }
}
