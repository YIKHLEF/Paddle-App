/**
 * Composant Button réutilisable
 * Supporte différents variants, tailles et états
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  // Déterminer les couleurs selon le variant
  const getVariantStyles = (): { backgroundColor: string; textColor: string; borderColor?: string } => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.textWhite,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          textColor: theme.colors.textWhite,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: theme.colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          textColor: theme.colors.textWhite,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.textWhite,
        };
    }
  };

  // Déterminer la taille
  const getSizeStyles = (): { height: number; paddingHorizontal: number; fontSize: number } => {
    switch (size) {
      case 'small':
        return {
          height: theme.dimensions.buttonHeight.small,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.fontSize.sm,
        };
      case 'medium':
        return {
          height: theme.dimensions.buttonHeight.medium,
          paddingHorizontal: theme.spacing.base,
          fontSize: theme.fontSize.base,
        };
      case 'large':
        return {
          height: theme.dimensions.buttonHeight.large,
          paddingHorizontal: theme.spacing.lg,
          fontSize: theme.fontSize.md,
        };
      default:
        return {
          height: theme.dimensions.buttonHeight.medium,
          paddingHorizontal: theme.spacing.base,
          fontSize: theme.fontSize.base,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyle: ViewStyle = {
    backgroundColor: disabled ? theme.colors.borderLight : variantStyles.backgroundColor,
    height: sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...(variantStyles.borderColor && {
      borderWidth: 1,
      borderColor: disabled ? theme.colors.borderLight : variantStyles.borderColor,
    }),
    ...(fullWidth && { width: '100%' }),
    ...theme.shadows.sm,
  };

  const buttonTextStyle: TextStyle = {
    color: disabled ? theme.colors.textTertiary : variantStyles.textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    fontFamily: theme.fontFamily.semiBold,
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyle, style]}
      activeOpacity={0.7}
      testID="button-container"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={disabled ? theme.colors.textTertiary : variantStyles.textColor}
          testID="button-loading-indicator"
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={iconSize}
              color={disabled ? theme.colors.textTertiary : variantStyles.textColor}
              style={{ marginRight: theme.spacing.sm }}
              testID="button-icon"
            />
          )}
          <Text style={[buttonTextStyle, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={iconSize}
              color={disabled ? theme.colors.textTertiary : variantStyles.textColor}
              style={{ marginLeft: theme.spacing.sm }}
              testID="button-icon"
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
