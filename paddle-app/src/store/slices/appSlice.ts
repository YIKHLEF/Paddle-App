/**
 * Redux slice pour les paramètres de l'application
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en' | 'es';
  notificationsEnabled: boolean;
  locationPermissionGranted: boolean;
  isFirstLaunch: boolean;
  onboardingCompleted: boolean;
}

const initialState: AppState = {
  theme: 'auto',
  language: 'fr',
  notificationsEnabled: true,
  locationPermissionGranted: false,
  isFirstLaunch: true,
  onboardingCompleted: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Changer le thème
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },

    // Changer la langue
    setLanguage: (state, action: PayloadAction<'fr' | 'en' | 'es'>) => {
      state.language = action.payload;
    },

    // Toggle notifications
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },

    // Set notifications
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },

    // Set location permission
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermissionGranted = action.payload;
    },

    // Marquer l'onboarding comme complété
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
      state.isFirstLaunch = false;
    },

    // Marquer comme pas premier lancement
    setNotFirstLaunch: (state) => {
      state.isFirstLaunch = false;
    },

    // Reset app state (pour déconnexion complète)
    resetAppState: () => initialState,
  },
});

export const {
  setTheme,
  setLanguage,
  toggleNotifications,
  setNotificationsEnabled,
  setLocationPermission,
  completeOnboarding,
  setNotFirstLaunch,
  resetAppState,
} = appSlice.actions;

export default appSlice.reducer;
