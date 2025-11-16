/**
 * Composant ErrorMessage
 * Affiche un message d'erreur avec icône et action de retry
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  icon?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Une erreur est survenue',
  onRetry,
  retryText = 'Réessayer',
  icon = 'alert-circle-outline',
  fullScreen = false,
  style,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = fullScreen
    ? {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xl,
      }
    : {
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
      };

  return (
    <View style={[containerStyle, style]} testID="error-container">
      <Icon name={icon} size={64} color={theme.colors.error} />

      <Text
        style={[
          styles.message,
          {
            color: theme.colors.textPrimary,
            marginTop: theme.spacing.lg,
            fontFamily: theme.fontFamily.regular,
          },
        ]}
      >
        {message}
      </Text>

      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          variant="primary"
          icon="refresh"
          style={{ marginTop: theme.spacing.lg }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default ErrorMessage;
