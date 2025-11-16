/**
 * Thème principal de l'application Paddle
 * Design System complet
 */

import { Colors, DarkColors } from '@/constants/colors';
import { Typography, FontFamily, FontSize, LineHeight, FontWeight } from './typography';

/**
 * Système d'espacement basé sur 8pt
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

/**
 * Border Radius
 */
export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

/**
 * Dimensions des composants
 */
export const Dimensions = {
  buttonHeight: {
    small: 36,
    medium: 44,
    large: 52,
  },
  inputHeight: {
    small: 36,
    medium: 44,
    large: 52,
  },
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
  },
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
    xxl: 96,
  },
  cardMinHeight: 120,
  headerHeight: 56,
  tabBarHeight: 56,
  bottomSheetHandle: 4,
} as const;

/**
 * Shadows (iOS style)
 */
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

/**
 * Animations
 */
export const Animation = {
  duration: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

/**
 * Z-Index
 */
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * Thème Light Mode
 */
export const LightTheme = {
  dark: false,
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  dimensions: Dimensions,
  shadows: Shadows,
  animation: Animation,
  zIndex: ZIndex,
  fontFamily: FontFamily,
  fontSize: FontSize,
  lineHeight: LineHeight,
  fontWeight: FontWeight,
} as const;

/**
 * Thème Dark Mode
 */
export const DarkTheme = {
  dark: true,
  colors: DarkColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  dimensions: Dimensions,
  shadows: Shadows,
  animation: Animation,
  zIndex: ZIndex,
  fontFamily: FontFamily,
  fontSize: FontSize,
  lineHeight: LineHeight,
  fontWeight: FontWeight,
} as const;

/**
 * Type du thème
 */
export type Theme = typeof LightTheme;

/**
 * Export par défaut
 */
export default LightTheme;
