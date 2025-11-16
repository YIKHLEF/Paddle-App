/**
 * Hook personnalisé pour accéder au thème
 */

import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { LightTheme, DarkTheme, Theme } from '@/theme/theme';
import type { RootState } from '@/store';

/**
 * Hook pour obtenir le thème actuel
 * Prend en compte les préférences utilisateur et le mode système
 */
export const useTheme = (): Theme => {
  // Récupérer le thème depuis Redux (préférence utilisateur)
  const themePreference = useSelector((state: RootState) => state.app?.theme || 'auto');

  // Récupérer le mode système
  const systemColorScheme = useColorScheme();

  // Déterminer le thème à utiliser
  let activeTheme: Theme;

  if (themePreference === 'auto') {
    activeTheme = systemColorScheme === 'dark' ? DarkTheme : LightTheme;
  } else if (themePreference === 'dark') {
    activeTheme = DarkTheme;
  } else {
    activeTheme = LightTheme;
  }

  return activeTheme;
};

/**
 * Hook pour obtenir uniquement les couleurs
 */
export const useColors = () => {
  const theme = useTheme();
  return theme.colors;
};

/**
 * Hook pour savoir si on est en dark mode
 */
export const useIsDarkMode = (): boolean => {
  const theme = useTheme();
  return theme.dark;
};

export default useTheme;
