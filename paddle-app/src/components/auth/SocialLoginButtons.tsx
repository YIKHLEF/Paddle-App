/**
 * Boutons de connexion sociale
 * Google, Apple, Facebook
 */

import React, { useState } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/common';
import { authService } from '@/api/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';

interface SocialLoginButtonsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSuccess,
  onError,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<{
    google: boolean;
    apple: boolean;
    facebook: boolean;
  }>({
    google: false,
    apple: false,
    facebook: false,
  });

  /**
   * Connexion avec Google
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading({ ...loading, google: true });

      // Configuration Google Sign-In (à faire une seule fois au démarrage de l'app)
      await GoogleSignin.hasPlayServices();

      // Sign in
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.idToken) {
        throw new Error('Impossible de récupérer le token Google');
      }

      // Envoyer le token au backend
      const response = await authService.loginWithGoogle(userInfo.idToken);

      // Stocker dans Redux
      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      }));

      onSuccess?.();
    } catch (error: any) {
      console.error('Erreur Google Sign-In:', error);

      let errorMessage = 'Échec de la connexion avec Google';

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Connexion annulée';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Connexion déjà en cours';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services non disponible';
      }

      onError?.(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  /**
   * Connexion avec Apple (iOS uniquement)
   */
  const handleAppleSignIn = async () => {
    try {
      setLoading({ ...loading, apple: true });

      // Démarrer la requête Apple
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Récupérer les credentials
      const { identityToken, fullName } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error('Impossible de récupérer le token Apple');
      }

      // Envoyer au backend
      const response = await authService.loginWithApple(
        identityToken,
        fullName?.givenName && fullName?.familyName
          ? {
              firstName: fullName.givenName,
              lastName: fullName.familyName,
            }
          : undefined
      );

      // Stocker dans Redux
      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      }));

      onSuccess?.();
    } catch (error: any) {
      console.error('Erreur Apple Sign-In:', error);

      if (error.code !== '1001') { // 1001 = user cancelled
        const errorMessage = 'Échec de la connexion avec Apple';
        onError?.(errorMessage);
        Alert.alert('Erreur', errorMessage);
      }
    } finally {
      setLoading({ ...loading, apple: false });
    }
  };

  /**
   * Connexion avec Facebook
   */
  const handleFacebookSignIn = async () => {
    try {
      setLoading({ ...loading, facebook: true });

      // Login avec Facebook
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw new Error('Connexion annulée');
      }

      // Récupérer l'access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Impossible de récupérer le token Facebook');
      }

      // Envoyer au backend
      const response = await authService.loginWithFacebook(data.accessToken);

      // Stocker dans Redux
      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      }));

      onSuccess?.();
    } catch (error: any) {
      console.error('Erreur Facebook Sign-In:', error);

      const errorMessage = 'Échec de la connexion avec Facebook';
      onError?.(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading({ ...loading, facebook: false });
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton Google */}
      <Button
        title="Continuer avec Google"
        onPress={handleGoogleSignIn}
        variant="outline"
        icon="google"
        iconPosition="left"
        loading={loading.google}
        disabled={loading.apple || loading.facebook}
        style={[styles.button, { borderColor: theme.colors.border }]}
        testID="google-signin-button"
      />

      {/* Bouton Apple (iOS uniquement) */}
      {Platform.OS === 'ios' && (
        <Button
          title="Continuer avec Apple"
          onPress={handleAppleSignIn}
          variant="outline"
          icon="apple"
          iconPosition="left"
          loading={loading.apple}
          disabled={loading.google || loading.facebook}
          style={[styles.button, { borderColor: theme.colors.border }]}
          testID="apple-signin-button"
        />
      )}

      {/* Bouton Facebook */}
      <Button
        title="Continuer avec Facebook"
        onPress={handleFacebookSignIn}
        variant="outline"
        icon="facebook"
        iconPosition="left"
        loading={loading.facebook}
        disabled={loading.google || loading.apple}
        style={[styles.button, { borderColor: theme.colors.border }]}
        testID="facebook-signin-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});
