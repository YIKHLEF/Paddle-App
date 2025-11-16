/**
 * Composant Loading
 * Affiche un indicateur de chargement
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  text,
  fullScreen = false,
  style,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = fullScreen
    ? {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.overlay,
      }
    : {
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
      };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && (
        <Text
          style={[
            styles.text,
            {
              color: fullScreen ? theme.colors.textWhite : theme.colors.textPrimary,
              marginTop: theme.spacing.md,
              fontFamily: theme.fontFamily.regular,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Loading;
