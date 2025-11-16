/**
 * Configuration de l'authentification sociale
 * À initialiser au démarrage de l'application
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Settings } from 'react-native-fbsdk-next';
import Config from 'react-native-config';

/**
 * Configuration Google Sign-In
 */
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID, // Du projet Firebase
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
    accountName: '',
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID, // Optionnel
  });
};

/**
 * Configuration Facebook SDK
 */
export const configureFacebookSDK = () => {
  Settings.initializeSDK();
  // Auto log app events activé par défaut
  Settings.setAutoLogAppEventsEnabled(true);
  Settings.setAdvertiserIDCollectionEnabled(true);
};

/**
 * Initialiser toutes les configurations sociales
 */
export const initializeSocialAuth = () => {
  configureGoogleSignIn();
  configureFacebookSDK();
  console.log('✅ Social auth configured');
};
