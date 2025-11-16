/**
 * Navigateur racine de l'application
 * Gère la navigation entre Auth et Main selon l'état d'authentification
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/store/hooks';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          // Utilisateur authentifié => Main App
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          // Utilisateur non authentifié => Auth Flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}

        {/* Modals globaux (accessibles partout) */}
        {/* Ces écrans peuvent être ajoutés plus tard */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
