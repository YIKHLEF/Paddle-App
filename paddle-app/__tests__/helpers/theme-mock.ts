/**
 * Shared theme mock for tests
 */

export const mockTheme = {
  dark: false,
  colors: {
    // Primary colors
    primary: '#0066FF',
    primaryDark: '#0052CC',
    primaryLight: '#3384FF',
    secondary: '#00D084',
    secondaryDark: '#00A86B',
    secondaryLight: '#33DDA3',
    accent: '#FF6B35',

    // Semantic colors
    success: '#10B981',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#3B82F6',

    // Text colors
    text: '#2C3E50',
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    textTertiary: '#A0A0A0',
    textWhite: '#FFFFFF',
    textDisabled: '#CBD5E0',

    // Background colors
    background: '#F8F9FA',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F0F0F0',

    // Surface colors
    surface: '#FFFFFF',
    surfaceSecondary: '#F8F9FA',

    // Border colors
    border: '#E5E7EB',
    borderLight: '#F0F0F0',
    borderDark: '#D1D5DB',

    // Status colors
    online: '#10B981',
    offline: '#6B7280',
    busy: '#EF4444',
    away: '#F59E0B',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },

  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  dimensions: {
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
  },

  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    semiBold: 'System',
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    md: 28,
    lg: 32,
    xl: 36,
    xxl: 40,
    xxxl: 48,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  shadows: {
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
  },

  animation: {
    duration: {
      instant: 0,
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};
