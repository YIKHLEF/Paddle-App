/**
 * Composant Card réutilisable
 * Container avec ombre et padding pour afficher du contenu
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  onPress,
  style,
  disabled = false,
}) => {
  const theme = useTheme();

  // Déterminer le padding
  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'medium':
        return theme.spacing.base;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.base;
    }
  };

  // Déterminer le style selon le variant
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.backgroundSecondary,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: theme.borderRadius.lg,
    padding: getPadding(),
    overflow: 'hidden',
    ...getVariantStyle(),
  };

  // Si onPress est défini, utiliser TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[cardStyle, style]}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Sinon, utiliser View
  return <View style={[cardStyle, style]}>{children}</View>;
};

/**
 * Composant CardHeader - Header de la card
 */
interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          paddingBottom: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.borderLight,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * Composant CardContent - Contenu principal de la card
 */
interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.content,
        {
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * Composant CardFooter - Footer de la card
 */
interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingTop: theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderLight,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {},
  content: {},
  footer: {},
});

export default Card;
