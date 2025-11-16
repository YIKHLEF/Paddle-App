/**
 * Système de typographie
 * Basé sur les guidelines de Material Design et iOS Human Interface Guidelines
 */

import { Platform } from 'react-native';

/**
 * Familles de polices par plateforme
 */
export const FontFamily = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'SF Pro Text Medium',
    android: 'Roboto Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'SF Pro Display Bold',
    android: 'Roboto Bold',
    default: 'System',
  }),
  semiBold: Platform.select({
    ios: 'SF Pro Display Semibold',
    android: 'Roboto Medium',
    default: 'System',
  }),
} as const;

/**
 * Tailles de police
 */
export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

/**
 * Line Heights
 */
export const LineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  md: 28,
  lg: 32,
  xl: 36,
  xxl: 40,
  xxxl: 48,
} as const;

/**
 * Font Weights
 */
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
} as const;

/**
 * Styles de texte prédéfinis
 */
export const Typography = {
  // Headers
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxxl,
    lineHeight: LineHeight.xxxl,
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    lineHeight: LineHeight.xxl,
    fontWeight: FontWeight.bold,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    fontWeight: FontWeight.semiBold,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.semiBold,
  },
  h5: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.semiBold,
  },
  h6: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontWeight: FontWeight.semiBold,
  },

  // Body text
  body1: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontWeight: FontWeight.regular,
  },
  body2: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.regular,
  },

  // Subtitle
  subtitle1: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontWeight: FontWeight.medium,
  },
  subtitle2: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.medium,
  },

  // Caption & Overline
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.regular,
  },
  overline: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },

  // Button
  button: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.25,
  },

  // Links
  link: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontWeight: FontWeight.regular,
    textDecorationLine: 'underline' as const,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;
