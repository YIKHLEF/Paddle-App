/**
 * Composant Badge
 * Affiche un badge coloré avec du texte
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';

interface BadgeProps {
  label: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'expert'
    | 'pro';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  icon,
  style,
}) => {
  const theme = useTheme();

  // Déterminer les couleurs selon le variant
  const getColors = (): { backgroundColor: string; textColor: string } => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: `${theme.colors.primary}20`,
          textColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: `${theme.colors.secondary}20`,
          textColor: theme.colors.secondary,
        };
      case 'success':
        return {
          backgroundColor: `${theme.colors.success}20`,
          textColor: theme.colors.success,
        };
      case 'error':
        return {
          backgroundColor: `${theme.colors.error}20`,
          textColor: theme.colors.error,
        };
      case 'warning':
        return {
          backgroundColor: `${theme.colors.warning}20`,
          textColor: theme.colors.warning,
        };
      case 'info':
        return {
          backgroundColor: `${theme.colors.info}20`,
          textColor: theme.colors.info,
        };
      case 'beginner':
        return {
          backgroundColor: `${theme.colors.skillBeginner}20`,
          textColor: theme.colors.skillBeginner,
        };
      case 'intermediate':
        return {
          backgroundColor: `${theme.colors.skillIntermediate}20`,
          textColor: theme.colors.skillIntermediate,
        };
      case 'advanced':
        return {
          backgroundColor: `${theme.colors.skillAdvanced}20`,
          textColor: theme.colors.skillAdvanced,
        };
      case 'expert':
        return {
          backgroundColor: `${theme.colors.skillExpert}20`,
          textColor: theme.colors.skillExpert,
        };
      case 'pro':
        return {
          backgroundColor: `${theme.colors.skillPro}20`,
          textColor: theme.colors.skillPro,
        };
      default:
        return {
          backgroundColor: `${theme.colors.primary}20`,
          textColor: theme.colors.primary,
        };
    }
  };

  // Déterminer la taille
  const getSize = (): { paddingVertical: number; paddingHorizontal: number; fontSize: number } => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          fontSize: theme.fontSize.xs,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.fontSize.sm,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.base,
          fontSize: theme.fontSize.base,
        };
      default:
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.fontSize.sm,
        };
    }
  };

  const colors = getColors();
  const sizeStyles = getSize();
  const iconSize = size === 'small' ? 12 : size === 'large' ? 18 : 14;

  const badgeStyle: ViewStyle = {
    backgroundColor: colors.backgroundColor,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  };

  const textStyle: TextStyle = {
    color: colors.textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    fontFamily: theme.fontFamily.semiBold,
  };

  return (
    <View style={[badgeStyle, style]}>
      {icon && <Icon name={icon} size={iconSize} color={colors.textColor} style={styles.icon} />}
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
  },
});

/**
 * Composant SkillBadge - Badge spécialisé pour le niveau de compétence
 */
interface SkillBadgeProps {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ level, size = 'medium', style }) => {
  const labels: Record<string, string> = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    ADVANCED: 'Avancé',
    EXPERT: 'Expert',
    PRO: 'Pro',
  };

  const variants: Record<string, any> = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
    EXPERT: 'expert',
    PRO: 'pro',
  };

  return (
    <Badge
      label={labels[level] || level}
      variant={variants[level]}
      size={size}
      icon="trophy"
      style={style}
    />
  );
};

/**
 * Composant SubscriptionBadge - Badge spécialisé pour l'abonnement
 */
interface SubscriptionBadgeProps {
  tier: 'FREE' | 'STANDARD' | 'PREMIUM';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  tier,
  size = 'medium',
  style,
}) => {
  const labels: Record<string, string> = {
    FREE: 'Gratuit',
    STANDARD: 'Standard',
    PREMIUM: 'Premium',
  };

  const variants: Record<string, any> = {
    FREE: 'info',
    STANDARD: 'primary',
    PREMIUM: 'warning',
  };

  const icons: Record<string, string> = {
    FREE: 'account',
    STANDARD: 'star',
    PREMIUM: 'crown',
  };

  return (
    <Badge
      label={labels[tier] || tier}
      variant={variants[tier]}
      size={size}
      icon={icons[tier]}
      style={style}
    />
  );
};

export default Badge;
