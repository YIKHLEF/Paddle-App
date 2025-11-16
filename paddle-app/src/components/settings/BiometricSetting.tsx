/**
 * Composant de paramètre biométrique
 * À utiliser dans l'écran Settings
 */

import React, { useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBiometric } from '@/hooks/useBiometric';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BiometricSettingProps {
  onToggle?: (enabled: boolean) => void;
}

export const BiometricSetting: React.FC<BiometricSettingProps> = ({ onToggle }) => {
  const theme = useTheme();
  const { isAvailable, isEnabled, loading, enable, disable, getBiometricName } = useBiometric();

  /**
   * Gérer le toggle du switch
   */
  const handleToggle = async (value: boolean) => {
    if (value) {
      // Activer la biométrie
      const success = await enable();

      if (success) {
        Alert.alert(
          'Activé',
          `${getBiometricName()} activé pour cette application`
        );
        onToggle?.(true);
      } else {
        Alert.alert(
          'Échec',
          'Impossible d\'activer l\'authentification biométrique'
        );
      }
    } else {
      // Désactiver la biométrie
      Alert.alert(
        'Désactiver la biométrie ?',
        'Vous devrez utiliser votre mot de passe pour vous connecter',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Désactiver',
            style: 'destructive',
            onPress: async () => {
              await disable();
              Alert.alert('Désactivé', 'Authentification biométrique désactivée');
              onToggle?.(false);
            },
          },
        ]
      );
    }
  };

  // Ne pas afficher si pas disponible
  if (!isAvailable || loading) {
    return null;
  }

  const biometricName = getBiometricName();
  const iconName = biometricName.includes('Face') ? 'face-recognition' : 'fingerprint';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.leftContent}>
        <Icon name={iconName} size={24} color={theme.colors.primary} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {biometricName}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Connexion rapide et sécurisée
          </Text>
        </View>
      </View>

      <Switch
        value={isEnabled}
        onValueChange={handleToggle}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor={isEnabled ? theme.colors.background : theme.colors.surface}
        testID="biometric-switch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});
