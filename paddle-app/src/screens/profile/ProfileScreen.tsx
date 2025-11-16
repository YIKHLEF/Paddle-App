/**
 * Écran de profil utilisateur
 * Affiche les informations du profil, statistiques et paramètres
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {
  Card,
  CardContent,
  Avatar,
  Badge,
  SkillBadge,
  SubscriptionBadge,
  Button,
} from '@/components/common';
import type { MainTabParamList } from '@/navigation/types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Profile'>;

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  badge?: string;
  showChevron?: boolean;
  iconColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  badge,
  showChevron = true,
  iconColor,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuItemIcon,
            {
              backgroundColor: iconColor
                ? `${iconColor}20`
                : `${theme.colors.primary}20`,
            },
          ]}
        >
          <Icon
            name={icon}
            size={24}
            color={iconColor || theme.colors.primary}
          />
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.menuItemSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {badge && (
          <Badge label={badge} variant="error" size="small" style={styles.menuBadge} />
        )}
        {showChevron && (
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile
    console.log('Edit profile');
  };

  const handleSettings = () => {
    // TODO: Navigate to settings
    console.log('Settings');
  };

  const handleSubscription = () => {
    // TODO: Navigate to subscription
    console.log('Subscription');
  };

  const handleStatistics = () => {
    // TODO: Navigate to statistics
    console.log('Statistics');
  };

  const handleMatchHistory = () => {
    // TODO: Navigate to match history
    console.log('Match history');
  };

  const handleFavorites = () => {
    // TODO: Navigate to favorites
    console.log('Favorites');
  };

  const handleNotifications = () => {
    // TODO: Navigate to notifications
    console.log('Notifications');
  };

  const handleHelp = () => {
    // TODO: Navigate to help
    console.log('Help');
  };

  const handlePrivacy = () => {
    // TODO: Navigate to privacy
    console.log('Privacy');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profil</Text>
          <TouchableOpacity onPress={handleSettings}>
            <Icon name="cog" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <Card variant="elevated" padding="large" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              uri={user?.profilePicture}
              name={`${user?.firstName} ${user?.lastName}`}
              size="xxl"
              variant="circular"
              badge
              badgeColor={theme.colors.success}
            />
            <Button
              title="Modifier"
              onPress={handleEditProfile}
              variant="outline"
              size="small"
              icon="pencil"
              style={styles.editButton}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.profileUsername, { color: theme.colors.textSecondary }]}>
              @{user?.username || 'username'}
            </Text>

            <View style={styles.badges}>
              <SkillBadge level={user?.skillLevel || 'BEGINNER'} />
              <SubscriptionBadge tier={user?.subscriptionTier || 'FREE'} />
            </View>

            {user?.bio && (
              <Text style={[styles.profileBio, { color: theme.colors.textSecondary }]}>
                {user.bio}
              </Text>
            )}

            <View style={styles.profileMeta}>
              <View style={styles.metaItem}>
                <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  {user?.city || 'Non renseigné'}
                </Text>
              </View>
              {user?.preferredPosition && (
                <View style={styles.metaItem}>
                  <Icon name="tennis" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                    {user.preferredPosition === 'LEFT' ? 'Gauche' :
                     user.preferredPosition === 'RIGHT' ? 'Droite' : 'Les deux'}
                  </Text>
                </View>
              )}
              {user?.dominantHand && (
                <View style={styles.metaItem}>
                  <Icon name="hand-right" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                    {user.dominantHand === 'RIGHT' ? 'Droitier' : 'Gaucher'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Card variant="outlined" padding="medium" style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={handleStatistics}
              activeOpacity={0.7}
            >
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>24</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Matchs
              </Text>
            </TouchableOpacity>

            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

            <TouchableOpacity
              style={styles.statItem}
              onPress={handleStatistics}
              activeOpacity={0.7}
            >
              <Text style={[styles.statValue, { color: theme.colors.secondary }]}>16</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Victoires
              </Text>
            </TouchableOpacity>

            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

            <TouchableOpacity
              style={styles.statItem}
              onPress={handleStatistics}
              activeOpacity={0.7}
            >
              <Text style={[styles.statValue, { color: theme.colors.accent }]}>67%</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Ratio
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            ACTIVITÉ
          </Text>
          <Card variant="outlined" padding="none" style={styles.menuCard}>
            <MenuItem
              icon="chart-line"
              title="Statistiques"
              subtitle="Voir mes performances"
              onPress={handleStatistics}
            />
            <MenuItem
              icon="history"
              title="Historique des matchs"
              subtitle="Tous mes matchs passés"
              onPress={handleMatchHistory}
            />
            <MenuItem
              icon="heart"
              title="Favoris"
              subtitle="Joueurs et terrains favoris"
              onPress={handleFavorites}
            />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            ABONNEMENT
          </Text>
          <Card variant="outlined" padding="none" style={styles.menuCard}>
            <MenuItem
              icon="crown"
              title="Mon abonnement"
              subtitle={
                user?.subscriptionTier === 'FREE'
                  ? 'Gratuit'
                  : user?.subscriptionTier === 'STANDARD'
                  ? 'Standard - 9.99€/mois'
                  : 'Premium - 14.99€/mois'
              }
              onPress={handleSubscription}
              iconColor={theme.colors.warning}
            />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            PARAMÈTRES
          </Text>
          <Card variant="outlined" padding="none" style={styles.menuCard}>
            <MenuItem
              icon="bell"
              title="Notifications"
              subtitle="Gérer les notifications"
              onPress={handleNotifications}
              badge="3"
            />
            <MenuItem
              icon="shield-check"
              title="Confidentialité"
              subtitle="Confidentialité et sécurité"
              onPress={handlePrivacy}
            />
            <MenuItem
              icon="help-circle"
              title="Aide et support"
              subtitle="FAQ et contact"
              onPress={handleHelp}
            />
          </Card>
        </View>

        {/* Logout Button */}
        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          variant="danger"
          size="large"
          icon="logout"
          fullWidth
          style={styles.logoutButton}
        />

        {/* App Version */}
        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  editButton: {
    minWidth: 100,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  profileBio: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  profileMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  statsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuCard: {
    marginHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBadge: {
    marginRight: 4,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default ProfileScreen;
