/**
 * Palette de couleurs de l'application Paddle
 * Design System v1.0
 */

export const Colors = {
  // Couleurs principales
  primary: '#0066FF',           // Bleu électrique
  primaryDark: '#0052CC',
  primaryLight: '#338FFF',

  secondary: '#00D084',         // Vert paddle
  secondaryDark: '#00A86B',
  secondaryLight: '#33D99C',

  accent: '#FF6B35',            // Orange énergique
  accentDark: '#E5501A',
  accentLight: '#FF8556',

  // Couleurs de texte
  textPrimary: '#2C3E50',       // Gris foncé
  textSecondary: '#7F8C8D',
  textTertiary: '#BDC3C7',
  textWhite: '#FFFFFF',
  textBlack: '#000000',

  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#ECF0F1',

  // Surfaces
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // États
  success: '#27AE60',
  successLight: '#2ECC71',
  error: '#E74C3C',
  errorLight: '#EC7063',
  warning: '#F39C12',
  warningLight: '#F1C40F',
  info: '#3498DB',
  infoLight: '#5DADE2',

  // Bordures
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#BDBDBD',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',

  // Niveaux de compétence (badges)
  skillBeginner: '#3498DB',
  skillIntermediate: '#27AE60',
  skillAdvanced: '#F39C12',
  skillExpert: '#E74C3C',
  skillPro: '#9B59B6',

  // Abonnements
  subscriptionFree: '#95A5A6',
  subscriptionStandard: '#0066FF',
  subscriptionPremium: '#F39C12',

  // Transparents
  transparent: 'transparent',
  white50: 'rgba(255, 255, 255, 0.5)',
  white80: 'rgba(255, 255, 255, 0.8)',
  black50: 'rgba(0, 0, 0, 0.5)',
  black80: 'rgba(0, 0, 0, 0.8)',
} as const;

/**
 * Dark Mode Colors
 */
export const DarkColors = {
  primary: '#338FFF',
  primaryDark: '#0066FF',
  primaryLight: '#66AAFF',

  secondary: '#33D99C',
  secondaryDark: '#00D084',
  secondaryLight: '#66E4B3',

  accent: '#FF8556',
  accentDark: '#FF6B35',
  accentLight: '#FFA077',

  textPrimary: '#ECEFF1',
  textSecondary: '#B0BEC5',
  textTertiary: '#78909C',
  textWhite: '#FFFFFF',
  textBlack: '#000000',

  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  backgroundTertiary: '#2C2C2C',

  surface: '#1E1E1E',
  surfaceElevated: '#2C2C2C',
  overlay: 'rgba(0, 0, 0, 0.7)',

  success: '#2ECC71',
  successLight: '#58D68D',
  error: '#EC7063',
  errorLight: '#F1948A',
  warning: '#F1C40F',
  warningLight: '#F4D03F',
  info: '#5DADE2',
  infoLight: '#85C1E9',

  border: '#37474F',
  borderLight: '#455A64',
  borderDark: '#263238',

  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',

  skillBeginner: '#5DADE2',
  skillIntermediate: '#58D68D',
  skillAdvanced: '#F4D03F',
  skillExpert: '#EC7063',
  skillPro: '#BB8FCE',

  subscriptionFree: '#B0BEC5',
  subscriptionStandard: '#338FFF',
  subscriptionPremium: '#F4D03F',

  transparent: 'transparent',
  white50: 'rgba(255, 255, 255, 0.5)',
  white80: 'rgba(255, 255, 255, 0.8)',
  black50: 'rgba(0, 0, 0, 0.5)',
  black80: 'rgba(0, 0, 0, 0.8)',
} as const;

export type ColorName = keyof typeof Colors;
