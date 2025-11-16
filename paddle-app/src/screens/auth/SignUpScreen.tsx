/**
 * Écran d'inscription
 * Permet aux utilisateurs de créer un nouveau compte
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

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: keyof typeof formData): boolean => {
    const value = formData[field];
    let error = '';

    switch (field) {
      case 'firstName':
        if (!value) error = 'Prénom requis';
        else if (value.length < 2) error = 'Minimum 2 caractères';
        break;

      case 'lastName':
        if (!value) error = 'Nom requis';
        else if (value.length < 2) error = 'Minimum 2 caractères';
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = 'Email requis';
        else if (!emailRegex.test(value)) error = 'Email invalide';
        break;

      case 'password':
        if (!value) error = 'Mot de passe requis';
        else if (value.length < 8) error = 'Minimum 8 caractères';
        else if (!/[A-Z]/.test(value)) error = 'Doit contenir une majuscule';
        else if (!/[a-z]/.test(value)) error = 'Doit contenir une minuscule';
        else if (!/[0-9]/.test(value)) error = 'Doit contenir un chiffre';
        break;

      case 'confirmPassword':
        if (!value) error = 'Confirmation requise';
        else if (value !== formData.password) error = 'Les mots de passe ne correspondent pas';
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const fields: Array<keyof typeof formData> = [
      'firstName',
      'lastName',
      'email',
      'password',
      'confirmPassword',
    ];
    const results = fields.map((field) => validateField(field));
    return results.every((isValid) => isValid);
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    if (!acceptTerms) {
      // TODO: Show alert
      console.log('Please accept terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement signup logic with Redux action
      const { firstName, lastName, email, password } = formData;
      console.log('Sign up:', { firstName, lastName, email, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to login or directly to main app
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors((prev) => ({ ...prev, email: 'Cet email est déjà utilisé' }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    console.log('Google sign up');
    // TODO: Implement Google OAuth
  };

  const handleAppleSignUp = async () => {
    console.log('Apple sign up');
    // TODO: Implement Apple Sign In
  };

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Créer un compte</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Rejoignez la communauté Paddle
            </Text>
          </View>

          {/* Sign Up Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Input
                  label="Prénom"
                  value={formData.firstName}
                  onChangeText={(text) => updateField('firstName', text)}
                  onBlur={() => validateField('firstName')}
                  error={errors.firstName}
                  placeholder="Jean"
                  autoCapitalize="words"
                  textContentType="givenName"
                  required
                />
              </View>

              <View style={styles.halfField}>
                <Input
                  label="Nom"
                  value={formData.lastName}
                  onChangeText={(text) => updateField('lastName', text)}
                  onBlur={() => validateField('lastName')}
                  error={errors.lastName}
                  placeholder="Dupont"
                  autoCapitalize="words"
                  textContentType="familyName"
                  required
                />
              </View>
            </View>

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              onBlur={() => validateField('email')}
              error={errors.email}
              leftIcon="email"
              placeholder="votre@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              required
            />

            <Input
              label="Mot de passe"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              onBlur={() => validateField('password')}
              error={errors.password}
              hint="Min. 8 caractères avec majuscule, minuscule et chiffre"
              leftIcon="lock"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              required
            />

            <Input
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              onBlur={() => validateField('confirmPassword')}
              error={errors.confirmPassword}
              leftIcon="lock-check"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              required
            />

            {/* Terms and Conditions */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: acceptTerms ? theme.colors.primary : theme.colors.border,
                    backgroundColor: acceptTerms ? theme.colors.primary : 'transparent',
                  },
                ]}
              >
                {acceptTerms && <Icon name="check" size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                J'accepte les{' '}
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  Conditions d'utilisation
                </Text>{' '}
                et la{' '}
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  Politique de confidentialité
                </Text>
              </Text>
            </TouchableOpacity>

            <Button
              title="S'inscrire"
              onPress={handleSignUp}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              icon="account-plus"
            />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
              Ou s'inscrire avec
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Social Sign Up */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, { borderColor: theme.colors.border }]}
              onPress={handleGoogleSignUp}
            >
              <Icon name="google" size={24} color="#DB4437" />
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, { borderColor: theme.colors.border }]}
                onPress={handleAppleSignUp}
              >
                <Icon name="apple" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
              Déjà un compte ?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                Se connecter
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpScreen;
