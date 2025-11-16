/**
 * Navigateur pour les écrans d'authentification
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';

// Import des écrans (à créer)
// import OnboardingScreen from '@/screens/auth/OnboardingScreen';
// import LoginScreen from '@/screens/auth/LoginScreen';
// import SignUpScreen from '@/screens/auth/SignUpScreen';
// import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';

// Placeholder screens temporaires
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding">
        {() => <PlaceholderScreen title="Onboarding" />}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {() => <PlaceholderScreen title="Login" />}
      </Stack.Screen>

      <Stack.Screen name="SignUp">
        {() => <PlaceholderScreen title="Sign Up" />}
      </Stack.Screen>

      <Stack.Screen name="ForgotPassword">
        {() => <PlaceholderScreen title="Forgot Password" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

export default AuthNavigator;
