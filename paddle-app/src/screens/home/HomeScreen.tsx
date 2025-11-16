/**
 * Écran d'accueil (Home/Dashboard)
 * Affiche les activités récentes, matchs à venir, courts à proximité
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { Card, CardHeader, CardContent, Avatar, Badge, Button } from '@/components/common';
import type { MainTabParamList } from '@/navigation/types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

// Mock data (à remplacer par des données réelles de l'API)
const upcomingMatches = [
  {
    id: '1',
    title: 'Match amical',
    date: '2025-11-17',
    time: '14:00',
    court: 'Padel Center Paris',
    players: [
      { id: '1', name: 'Jean Dupont', avatar: null },
      { id: '2', name: 'Marie Martin', avatar: null },
    ],
    playersNeeded: 1,
  },
  {
    id: '2',
    title: 'Match classé',
    date: '2025-11-18',
    time: '18:30',
    court: 'Club Sportif Lyon',
    players: [
      { id: '3', name: 'Pierre Dubois', avatar: null },
    ],
    playersNeeded: 2,
  },
];

const nearbyCourts = [
  {
    id: '1',
    name: 'Padel Center Paris',
    distance: '1.2 km',
    rating: 4.5,
    pricePerHour: 25,
    available: true,
  },
  {
    id: '2',
    name: 'Club Sportif Lyon',
    distance: '2.5 km',
    rating: 4.8,
    pricePerHour: 30,
    available: false,
  },
  {
    id: '3',
    name: 'Padel Club Marseille',
    distance: '3.8 km',
    rating: 4.3,
    pricePerHour: 22,
    available: true,
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch fresh data from API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Search')}
      >
        <Icon name="account-search" size={28} color="#FFFFFF" />
        <Text style={styles.quickActionText}>Trouver un partenaire</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: theme.colors.secondary }]}
        onPress={() => {
          // TODO: Navigate to booking screen
          console.log('Navigate to booking');
        }}
      >
        <Icon name="tennis-ball" size={28} color="#FFFFFF" />
        <Text style={styles.quickActionText}>Réserver un terrain</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMatchCard = ({ item }: { item: typeof upcomingMatches[0] }) => (
    <Card
      variant="elevated"
      padding="medium"
      style={styles.matchCard}
      onPress={() => {
        // TODO: Navigate to match details
        console.log('Navigate to match:', item.id);
      }}
    >
      <CardHeader>
        <View style={styles.matchHeader}>
          <View style={styles.matchInfo}>
            <Text style={[styles.matchTitle, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <View style={styles.matchMeta}>
              <Icon name="calendar" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.matchMetaText, { color: theme.colors.textSecondary }]}>
                {item.date} · {item.time}
              </Text>
            </View>
            <View style={styles.matchMeta}>
              <Icon name="map-marker" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.matchMetaText, { color: theme.colors.textSecondary }]}>
                {item.court}
              </Text>
            </View>
          </View>
          <Badge
            label={`${item.playersNeeded} place${item.playersNeeded > 1 ? 's' : ''}`}
            variant="primary"
            size="small"
          />
        </View>
      </CardHeader>

      <CardContent>
        <View style={styles.playersContainer}>
          <Text style={[styles.playersLabel, { color: theme.colors.textSecondary }]}>
            Joueurs :
          </Text>
          <View style={styles.avatarList}>
            {item.players.map((player) => (
              <Avatar
                key={player.id}
                name={player.name}
                size="sm"
                variant="circular"
                style={styles.playerAvatar}
              />
            ))}
          </View>
        </View>
      </CardContent>
    </Card>
  );

  const renderCourtCard = ({ item }: { item: typeof nearbyCourts[0] }) => (
    <Card
      variant="outlined"
      padding="medium"
      style={styles.courtCard}
      onPress={() => {
        // TODO: Navigate to court details
        console.log('Navigate to court:', item.id);
      }}
    >
      <View style={styles.courtHeader}>
        <View style={styles.courtInfo}>
          <Text style={[styles.courtName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <View style={styles.courtMeta}>
            <Icon name="map-marker" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.courtMetaText, { color: theme.colors.textSecondary }]}>
              {item.distance}
            </Text>
            <Icon
              name="star"
              size={14}
              color={theme.colors.warning}
              style={styles.ratingIcon}
            />
            <Text style={[styles.courtMetaText, { color: theme.colors.textSecondary }]}>
              {item.rating}
            </Text>
          </View>
          <Text style={[styles.courtPrice, { color: theme.colors.primary }]}>
            {item.pricePerHour}€/h
          </Text>
        </View>
        <Badge
          label={item.available ? 'Disponible' : 'Complet'}
          variant={item.available ? 'success' : 'error'}
          size="small"
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.firstName || 'Joueur'} 👋
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
          >
            <Avatar
              uri={user?.profilePicture}
              name={`${user?.firstName} ${user?.lastName}`}
              size="md"
              variant="circular"
              badge
              badgeColor={theme.colors.success}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Stats Card */}
        <Card variant="elevated" padding="medium" style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Matchs
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.secondary }]}>8</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Victoires
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.accent }]}>67%</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Ratio
              </Text>
            </View>
          </View>
        </Card>

        {/* Upcoming Matches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Prochains matchs
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Matches')}>
              <Text style={[styles.seeAllLink, { color: theme.colors.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          {upcomingMatches.length > 0 ? (
            <FlatList
              data={upcomingMatches}
              renderItem={renderMatchCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.matchesList}
            />
          ) : (
            <Card variant="outlined" padding="large">
              <View style={styles.emptyState}>
                <Icon name="tennis" size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  Aucun match à venir
                </Text>
                <Button
                  title="Trouver un match"
                  onPress={() => navigation.navigate('Search')}
                  variant="primary"
                  size="small"
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          )}
        </View>

        {/* Nearby Courts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Terrains à proximité
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllLink, { color: theme.colors.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={nearbyCourts}
            renderItem={renderCourtCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  matchesList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  matchCard: {
    width: 280,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  matchInfo: {
    flex: 1,
    marginRight: 8,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  matchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  matchMetaText: {
    fontSize: 13,
  },
  playersContainer: {
    marginTop: 12,
  },
  playersLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  avatarList: {
    flexDirection: 'row',
    gap: -8,
  },
  playerAvatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  courtCard: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
  courtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courtInfo: {
    flex: 1,
    marginRight: 8,
  },
  courtName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  courtMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  courtMetaText: {
    fontSize: 13,
  },
  ratingIcon: {
    marginLeft: 8,
  },
  courtPrice: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 16,
  },
  emptyButton: {
    minWidth: 150,
  },
});

export default HomeScreen;
