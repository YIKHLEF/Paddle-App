/**
 * Composant Avatar réutilisable
 * Affiche une image de profil avec fallback sur les initiales
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'circular' | 'rounded' | 'square';
  onPress?: () => void;
  showBadge?: boolean;
  badgeColor?: string;
  badgePosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 'md',
  variant = 'circular',
  onPress,
  showBadge = false,
  badgeColor,
  badgePosition = 'bottom-right',
  style,
}) => {
  const theme = useTheme();

  // Déterminer la taille
  const getSize = (): number => {
    switch (size) {
      case 'xs':
        return theme.dimensions.avatarSize.xs;
      case 'sm':
        return theme.dimensions.avatarSize.sm;
      case 'md':
        return theme.dimensions.avatarSize.md;
      case 'lg':
        return theme.dimensions.avatarSize.lg;
      case 'xl':
        return theme.dimensions.avatarSize.xl;
      case 'xxl':
        return theme.dimensions.avatarSize.xxl;
      default:
        return theme.dimensions.avatarSize.md;
    }
  };

  // Déterminer le border radius selon le variant
  const getBorderRadius = (): number => {
    const avatarSize = getSize();
    switch (variant) {
      case 'circular':
        return avatarSize / 2;
      case 'rounded':
        return theme.borderRadius.md;
      case 'square':
        return 0;
      default:
        return avatarSize / 2;
    }
  };

  // Extraire les initiales du nom
  const getInitials = (): string => {
    if (!name) return '?';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Générer une couleur de fond basée sur le nom
  const getBackgroundColor = (): string => {
    if (!name) return theme.colors.borderLight;

    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.accent,
      theme.colors.info,
      theme.colors.success,
      theme.colors.warning,
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const avatarSize = getSize();
  const borderRadius = getBorderRadius();
  const backgroundColor = getBackgroundColor();
  const fontSize = avatarSize * 0.4;

  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius,
    backgroundColor: imageUrl ? 'transparent' : backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  // Position du badge
  const getBadgePosition = (): ViewStyle => {
    const badgeSize = avatarSize * 0.25;
    const offset = -2;

    switch (badgePosition) {
      case 'top-right':
        return { top: offset, right: offset };
      case 'bottom-right':
        return { bottom: offset, right: offset };
      case 'top-left':
        return { top: offset, left: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      default:
        return { bottom: offset, right: offset };
    }
  };

  const badgeSize = avatarSize * 0.25;

  const renderAvatar = () => (
    <View style={[avatarStyle, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize,
              color: theme.colors.textWhite,
              fontFamily: theme.fontFamily.semiBold,
            },
          ]}
        >
          {getInitials()}
        </Text>
      )}

      {/* Badge */}
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: badgeColor || theme.colors.success,
              borderWidth: 2,
              borderColor: theme.colors.surface,
            },
            getBadgePosition(),
          ]}
          testID="avatar-badge"
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderAvatar()}
      </TouchableOpacity>
    );
  }

  return renderAvatar();
};

/**
 * Composant AvatarGroup - Groupe d'avatars superposés
 */
interface AvatarGroupProps {
  avatars: Array<{ imageUrl?: string; name?: string }>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  max?: number;
  spacing?: number;
  onPress?: () => void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 3,
  spacing = -8,
  onPress,
}) => {
  const theme = useTheme();
  const displayedAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const getSize = (): number => {
    switch (size) {
      case 'xs':
        return theme.dimensions.avatarSize.xs;
      case 'sm':
        return theme.dimensions.avatarSize.sm;
      case 'md':
        return theme.dimensions.avatarSize.md;
      case 'lg':
        return theme.dimensions.avatarSize.lg;
      case 'xl':
        return theme.dimensions.avatarSize.xl;
      case 'xxl':
        return theme.dimensions.avatarSize.xxl;
      default:
        return theme.dimensions.avatarSize.md;
    }
  };

  const avatarSize = getSize();

  const renderGroup = () => (
    <View style={styles.groupContainer}>
      {displayedAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupAvatar,
            {
              marginLeft: index > 0 ? spacing : 0,
              borderWidth: 2,
              borderColor: theme.colors.surface,
              borderRadius: avatarSize / 2,
            },
          ]}
        >
          <Avatar {...avatar} size={size} />
        </View>
      ))}

      {remainingCount > 0 && (
        <View
          style={[
            styles.remainingBadge,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: theme.colors.backgroundTertiary,
              marginLeft: spacing,
              borderWidth: 2,
              borderColor: theme.colors.surface,
            },
          ]}
        >
          <Text
            style={{
              fontSize: avatarSize * 0.35,
              color: theme.colors.textPrimary,
              fontFamily: theme.fontFamily.semiBold,
            }}
          >
            +{remainingCount}
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderGroup()}
      </TouchableOpacity>
    );
  }

  return renderGroup();
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {},
  remainingBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Avatar;
