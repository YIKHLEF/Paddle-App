/**
 * Écran de récupération de mot de passe
 * Permet aux utilisateurs de réinitialiser leur mot de passe
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { Button, Input } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email requis');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email invalide');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendResetEmail = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement password reset logic with API
      console.log('Send reset email to:', email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setEmailError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setEmailSent(false);
    handleSendResetEmail();
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (emailSent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          {/* Success Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.success}15` }]}>
            <Icon name="email-check" size={80} color={theme.colors.success} />
          </View>

          {/* Success Message */}
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>
            Email envoyé !
          </Text>
          <Text style={[styles.successMessage, { color: theme.colors.textSecondary }]}>
            Nous avons envoyé un lien de réinitialisation à
          </Text>
          <Text style={[styles.emailText, { color: theme.colors.primary }]}>{email}</Text>
          <Text style={[styles.successMessage, { color: theme.colors.textSecondary }]}>
            Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre
            mot de passe.
          </Text>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionItem}>
              <Icon name="numeric-1-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                Ouvrez l'email que nous avons envoyé
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Icon name="numeric-2-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                Cliquez sur le lien de réinitialisation
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Icon name="numeric-3-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                Créez un nouveau mot de passe
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Retour à la connexion"
              onPress={handleBackToLogin}
              variant="primary"
              size="large"
              fullWidth
              icon="login"
            />

            <TouchableOpacity style={styles.resendContainer} onPress={handleResendEmail}>
              <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
                Vous n'avez pas reçu l'email ?{' '}
              </Text>
              <Text style={[styles.resendLink, { color: theme.colors.primary }]}>
                Renvoyer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
              <Icon name="lock-reset" size={60} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Mot de passe oublié ?
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Pas de problème ! Entrez votre email et nous vous enverrons un lien pour réinitialiser
              votre mot de passe.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              error={emailError}
              leftIcon="email"
              placeholder="votre@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              required
            />

            <Button
              title="Envoyer le lien"
              onPress={handleSendResetEmail}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              icon="email-send"
            />
          </View>

          {/* Back to Login */}
          <View style={styles.loginContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleBackToLogin}
            >
              <Icon name="arrow-left" size={20} color={theme.colors.primary} />
              <Text style={[styles.loginText, { color: theme.colors.primary }]}>
                Retour à la connexion
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Success state styles
  successContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  instructionsContainer: {
    width: '100%',
    marginTop: 32,
    marginBottom: 40,
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
