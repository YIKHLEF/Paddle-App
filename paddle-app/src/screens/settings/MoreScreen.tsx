/**
 * Écran More/Settings
 * Paramètres et options supplémentaires de l'application
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { setTheme, setLanguage, toggleNotifications } from '@/store/slices/appSlice';
import { Card } from '@/components/common';
import type { MainTabParamList } from '@/navigation/types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'More'>;

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  iconColor?: string;
  rightElement?: React.ReactNode;
  testID?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  iconColor,
  rightElement,
  testID,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingsItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
    >
      <View style={styles.settingsItemLeft}>
        <View
          style={[
            styles.settingsItemIcon,
            {
              backgroundColor: iconColor
                ? `${iconColor}15`
                : `${theme.colors.primary}15`,
            },
          ]}
        >
          <Icon
            name={icon}
            size={22}
            color={iconColor || theme.colors.primary}
          />
        </View>
        <View style={styles.settingsItemText}>
          <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightElement}
        {showChevron && onPress && (
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const MoreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const appSettings = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.user);

  const handleThemeChange = () => {
    Alert.alert(
      'Thème',
      'Choisissez le thème de l\'application',
      [
        {
          text: 'Clair',
          onPress: () => dispatch(setTheme('light')),
        },
        {
          text: 'Sombre',
          onPress: () => dispatch(setTheme('dark')),
        },
        {
          text: 'Auto',
          onPress: () => dispatch(setTheme('auto')),
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Langue',
      'Choisissez la langue de l\'application',
      [
        {
          text: 'Français',
          onPress: () => dispatch(setLanguage('fr')),
        },
        {
          text: 'English',
          onPress: () => dispatch(setLanguage('en')),
        },
        {
          text: 'Español',
          onPress: () => dispatch(setLanguage('es')),
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const handleNotificationsToggle = () => {
    dispatch(toggleNotifications());
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const getThemeLabel = () => {
    switch (appSettings.theme) {
      case 'light': return 'Clair';
      case 'dark': return 'Sombre';
      case 'auto': return 'Automatique';
      default: return 'Automatique';
    }
  };

  const getLanguageLabel = () => {
    switch (appSettings.language) {
      case 'fr': return 'Français';
      case 'en': return 'English';
      case 'es': return 'Español';
      default: return 'Français';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Plus</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            COMPTE
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="account-circle"
              title="Mon profil"
              subtitle="Voir et modifier mon profil"
              onPress={() => navigation.navigate('Profile')}
              testID="settings-profile"
            />
            <SettingsItem
              icon="crown"
              title="Abonnement"
              subtitle={
                user?.subscriptionTier === 'FREE'
                  ? 'Gratuit'
                  : user?.subscriptionTier === 'STANDARD'
                  ? 'Standard - 9.99€/mois'
                  : 'Premium - 14.99€/mois'
              }
              onPress={() => {
                // TODO: Navigate to subscription screen
                console.log('Navigate to subscription');
              }}
              iconColor={theme.colors.warning}
              testID="settings-subscription"
            />
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            PRÉFÉRENCES
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="bell"
              title="Notifications"
              subtitle="Activer les notifications push"
              showChevron={false}
              rightElement={
                <Switch
                  value={appSettings.notificationsEnabled}
                  onValueChange={handleNotificationsToggle}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                  testID="settings-notifications-switch"
                />
              }
              testID="settings-notifications"
            />
            <SettingsItem
              icon="theme-light-dark"
              title="Thème"
              subtitle={getThemeLabel()}
              onPress={handleThemeChange}
              testID="settings-theme"
            />
            <SettingsItem
              icon="translate"
              title="Langue"
              subtitle={getLanguageLabel()}
              onPress={handleLanguageChange}
              testID="settings-language"
            />
          </Card>
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            ACTIVITÉ
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="history"
              title="Historique"
              subtitle="Voir tous mes matchs passés"
              onPress={() => {
                // TODO: Navigate to history screen
                console.log('Navigate to history');
              }}
              testID="settings-history"
            />
            <SettingsItem
              icon="heart"
              title="Favoris"
              subtitle="Joueurs et terrains favoris"
              onPress={() => {
                // TODO: Navigate to favorites screen
                console.log('Navigate to favorites');
              }}
              testID="settings-favorites"
            />
            <SettingsItem
              icon="chart-box"
              title="Statistiques"
              subtitle="Mes performances détaillées"
              onPress={() => {
                // TODO: Navigate to stats screen
                console.log('Navigate to stats');
              }}
              testID="settings-statistics"
            />
          </Card>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            SUPPORT
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="help-circle"
              title="Aide & FAQ"
              subtitle="Questions fréquentes"
              onPress={() => {
                // TODO: Navigate to help screen
                console.log('Navigate to help');
              }}
              iconColor={theme.colors.info}
              testID="settings-help"
            />
            <SettingsItem
              icon="email"
              title="Nous contacter"
              subtitle="support@paddle-app.com"
              onPress={() => {
                // TODO: Open email client
                console.log('Contact support');
              }}
              iconColor={theme.colors.info}
              testID="settings-contact"
            />
            <SettingsItem
              icon="star"
              title="Noter l'application"
              subtitle="Donner votre avis"
              onPress={() => {
                // TODO: Open app store rating
                console.log('Rate app');
              }}
              iconColor={theme.colors.warning}
              testID="settings-rate"
            />
          </Card>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            LÉGAL
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="file-document"
              title="Conditions d'utilisation"
              onPress={() => {
                // TODO: Navigate to terms screen
                console.log('Navigate to terms');
              }}
              testID="settings-terms"
            />
            <SettingsItem
              icon="shield-check"
              title="Politique de confidentialité"
              onPress={() => {
                // TODO: Navigate to privacy screen
                console.log('Navigate to privacy');
              }}
              testID="settings-privacy"
            />
            <SettingsItem
              icon="information"
              title="À propos"
              subtitle="Version 1.0.0"
              onPress={() => {
                // TODO: Navigate to about screen
                console.log('Navigate to about');
              }}
              testID="settings-about"
            />
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            onPress={handleLogout}
            testID="settings-logout"
          >
            <Icon name="logout" size={20} color={theme.colors.error} />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          Paddle App v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 13,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default MoreScreen;
