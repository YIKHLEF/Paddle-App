/**
 * Écran des matchs
 * Affiche les matchs à venir, en cours et passés
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
import { Button } from '@/components/common';
import { MatchCard, type MatchCardData } from '@/components/features';
import type { MainTabParamList } from '@/navigation/types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Matches'>;

type MatchTab = 'upcoming' | 'past' | 'organized';

// Mock data
const mockUpcomingMatches: MatchCardData[] = [
  {
    id: '1',
    title: 'Match amical - Doubles',
    type: 'FRIENDLY',
    format: 'DOUBLES',
    skillLevel: 'INTERMEDIATE',
    date: '2025-11-17',
    time: '14:00',
    court: 'Padel Center Paris',
    courtLocation: '75001 Paris',
    organizer: 'Jean Dupont',
    participants: [
      { id: '1', name: 'Jean Dupont', avatar: null },
      { id: '2', name: 'Marie Martin', avatar: null },
    ],
    maxPlayers: 4,
    distance: '2.1 km',
    price: 12.5,
  },
  {
    id: '2',
    title: 'Match classé',
    type: 'RANKED',
    format: 'DOUBLES',
    skillLevel: 'ADVANCED',
    date: '2025-11-18',
    time: '18:30',
    court: 'Club Sportif Lyon',
    organizer: 'Pierre Dubois',
    participants: [
      { id: '3', name: 'Pierre Dubois', avatar: null },
    ],
    maxPlayers: 4,
    distance: '3.5 km',
  },
];

const mockPastMatches: MatchCardData[] = [
  {
    id: '3',
    title: 'Tournoi du week-end',
    type: 'TOURNAMENT',
    format: 'DOUBLES',
    skillLevel: 'INTERMEDIATE',
    date: '2025-11-10',
    time: '10:00',
    court: 'Padel Arena',
    organizer: 'Club Padel Arena',
    participants: [
      { id: '4', name: 'Sophie Laurent', avatar: null },
      { id: '5', name: 'Luc Bernard', avatar: null },
      { id: '6', name: 'Emma Petit', avatar: null },
      { id: '7', name: 'Thomas Roux', avatar: null },
    ],
    maxPlayers: 4,
    distance: '1.8 km',
    price: 20,
  },
];

export const MatchesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<MatchTab>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [joinedMatches, setJoinedMatches] = useState<string[]>(['1']);

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch data from API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleMatchPress = (matchId: string) => {
    // TODO: Navigate to match details
    console.log('Navigate to match:', matchId);
  };

  const handleJoinMatch = (matchId: string) => {
    setJoinedMatches([...joinedMatches, matchId]);
    // TODO: Call API to join match
    console.log('Join match:', matchId);
  };

  const handleLeaveMatch = (matchId: string) => {
    setJoinedMatches(joinedMatches.filter(id => id !== matchId));
    // TODO: Call API to leave match
    console.log('Leave match:', matchId);
  };

  const handleCreateMatch = () => {
    // TODO: Navigate to create match screen
    console.log('Create match');
  };

  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'upcoming' && {
            borderBottomColor: theme.colors.primary,
          },
        ]}
        onPress={() => setActiveTab('upcoming')}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'upcoming' ? theme.colors.primary : theme.colors.textSecondary,
            },
          ]}
        >
          À venir ({mockUpcomingMatches.length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'organized' && {
            borderBottomColor: theme.colors.primary,
          },
        ]}
        onPress={() => setActiveTab('organized')}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'organized' ? theme.colors.primary : theme.colors.textSecondary,
            },
          ]}
        >
          Organisés (0)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'past' && {
            borderBottomColor: theme.colors.primary,
          },
        ]}
        onPress={() => setActiveTab('past')}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'past' ? theme.colors.primary : theme.colors.textSecondary,
            },
          ]}
        >
          Passés ({mockPastMatches.length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderMatchCard = ({ item }: { item: MatchCardData }) => {
    const isJoined = joinedMatches.includes(item.id);
    const isPast = activeTab === 'past';

    return (
      <MatchCard
        match={item}
        onPress={() => handleMatchPress(item.id)}
        onJoinPress={!isPast ? () => handleJoinMatch(item.id) : undefined}
        onLeavePress={!isPast && isJoined ? () => handleLeaveMatch(item.id) : undefined}
        isJoined={isJoined}
        style={styles.matchCard}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon
        name={
          activeTab === 'upcoming'
            ? 'calendar-blank'
            : activeTab === 'organized'
            ? 'account-group'
            : 'history'
        }
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {activeTab === 'upcoming'
          ? 'Aucun match à venir'
          : activeTab === 'organized'
          ? 'Aucun match organisé'
          : 'Aucun match passé'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {activeTab === 'upcoming'
          ? 'Recherchez des matchs ou créez le vôtre'
          : activeTab === 'organized'
          ? 'Organisez votre premier match'
          : 'Jouez des matchs pour les voir ici'}
      </Text>
      {(activeTab === 'upcoming' || activeTab === 'organized') && (
        <Button
          title="Créer un match"
          onPress={handleCreateMatch}
          variant="primary"
          size="medium"
          icon="plus"
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  const getMatchesForTab = (): MatchCardData[] => {
    switch (activeTab) {
      case 'upcoming':
        return mockUpcomingMatches;
      case 'organized':
        return []; // TODO: Fetch organized matches
      case 'past':
        return mockPastMatches;
      default:
        return [];
    }
  };

  const matches = getMatchesForTab();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Mes Matchs</Text>
        <TouchableOpacity onPress={handleCreateMatch}>
          <Icon name="plus-circle" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {renderTabs()}

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {matches.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={matches}
            renderItem={renderMatchCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.matchesList}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateMatch}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  matchesList: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  matchCard: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: 200,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default MatchesScreen;
