/**
 * Écran de recherche
 * Permet de rechercher des joueurs, des matchs et des terrains
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { Input, Card, Avatar, Badge, SkillBadge, Button } from '@/components/common';
import type { MainTabParamList } from '@/navigation/types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Search'>;

type SearchTab = 'players' | 'matches' | 'courts';

// Mock data
const mockPlayers = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    username: 'jeandupont',
    skillLevel: 'INTERMEDIATE' as const,
    distance: '2.3 km',
    matchesPlayed: 45,
    winRate: 62,
    profilePicture: null,
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    username: 'mariemartin',
    skillLevel: 'ADVANCED' as const,
    distance: '3.7 km',
    matchesPlayed: 78,
    winRate: 71,
    profilePicture: null,
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Dubois',
    username: 'pierredubois',
    skillLevel: 'BEGINNER' as const,
    distance: '1.5 km',
    matchesPlayed: 12,
    winRate: 50,
    profilePicture: null,
  },
];

const mockMatches = [
  {
    id: '1',
    title: 'Match amical - Doubles',
    type: 'FRIENDLY' as const,
    skillLevel: 'INTERMEDIATE' as const,
    date: '2025-11-17',
    time: '14:00',
    court: 'Padel Center Paris',
    organizer: 'Jean Dupont',
    playersCount: 3,
    maxPlayers: 4,
    distance: '2.1 km',
  },
  {
    id: '2',
    title: 'Match classé',
    type: 'RANKED' as const,
    skillLevel: 'ADVANCED' as const,
    date: '2025-11-18',
    time: '18:30',
    court: 'Club Sportif Lyon',
    organizer: 'Marie Martin',
    playersCount: 2,
    maxPlayers: 4,
    distance: '3.5 km',
  },
];

const mockCourts = [
  {
    id: '1',
    name: 'Padel Center Paris',
    distance: '1.2 km',
    rating: 4.5,
    reviewsCount: 124,
    pricePerHour: 25,
    courtsAvailable: 3,
    totalCourts: 6,
    type: 'INDOOR' as const,
  },
  {
    id: '2',
    name: 'Club Sportif Lyon',
    distance: '2.5 km',
    rating: 4.8,
    reviewsCount: 89,
    pricePerHour: 30,
    courtsAvailable: 0,
    totalCourts: 4,
    type: 'OUTDOOR' as const,
  },
];

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('players');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null);

  const skillLevels = [
    { value: 'BEGINNER', label: 'Débutant' },
    { value: 'INTERMEDIATE', label: 'Intermédiaire' },
    { value: 'ADVANCED', label: 'Avancé' },
    { value: 'EXPERT', label: 'Expert' },
    { value: 'PRO', label: 'Pro' },
  ];

  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'players' && {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
        ]}
        onPress={() => setActiveTab('players')}
      >
        <Icon
          name="account-group"
          size={20}
          color={activeTab === 'players' ? '#FFFFFF' : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'players' ? '#FFFFFF' : theme.colors.textSecondary,
            },
          ]}
        >
          Joueurs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'matches' && {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
        ]}
        onPress={() => setActiveTab('matches')}
      >
        <Icon
          name="tennis"
          size={20}
          color={activeTab === 'matches' ? '#FFFFFF' : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'matches' ? '#FFFFFF' : theme.colors.textSecondary,
            },
          ]}
        >
          Matchs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'courts' && {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
        ]}
        onPress={() => setActiveTab('courts')}
      >
        <Icon
          name="map-marker"
          size={20}
          color={activeTab === 'courts' ? '#FFFFFF' : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'courts' ? '#FFFFFF' : theme.colors.textSecondary,
            },
          ]}
        >
          Terrains
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filters}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: !selectedSkillLevel
                ? theme.colors.primary
                : `${theme.colors.primary}20`,
              borderColor: !selectedSkillLevel ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => setSelectedSkillLevel(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: !selectedSkillLevel ? '#FFFFFF' : theme.colors.text },
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        {skillLevels.map((level) => (
          <TouchableOpacity
            key={level.value}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedSkillLevel === level.value
                    ? theme.colors.primary
                    : `${theme.colors.primary}20`,
                borderColor:
                  selectedSkillLevel === level.value ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => setSelectedSkillLevel(level.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedSkillLevel === level.value ? '#FFFFFF' : theme.colors.text },
              ]}
            >
              {level.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPlayerCard = ({ item }: { item: typeof mockPlayers[0] }) => (
    <Card
      variant="outlined"
      padding="medium"
      style={styles.playerCard}
      onPress={() => {
        // TODO: Navigate to player profile
        console.log('View player:', item.id);
      }}
    >
      <View style={styles.playerHeader}>
        <Avatar
          uri={item.profilePicture}
          name={`${item.firstName} ${item.lastName}`}
          size="lg"
          variant="circular"
        />
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, { color: theme.colors.text }]}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={[styles.playerUsername, { color: theme.colors.textSecondary }]}>
            @{item.username}
          </Text>
          <SkillBadge level={item.skillLevel} size="small" style={styles.skillBadge} />
        </View>
        <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
      </View>

      <View style={styles.playerStats}>
        <View style={styles.playerStat}>
          <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.playerStatText, { color: theme.colors.textSecondary }]}>
            {item.distance}
          </Text>
        </View>
        <View style={styles.playerStat}>
          <Icon name="tennis" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.playerStatText, { color: theme.colors.textSecondary }]}>
            {item.matchesPlayed} matchs
          </Text>
        </View>
        <View style={styles.playerStat}>
          <Icon name="trophy" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.playerStatText, { color: theme.colors.textSecondary }]}>
            {item.winRate}% victoires
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderMatchCard = ({ item }: { item: typeof mockMatches[0] }) => (
    <Card
      variant="outlined"
      padding="medium"
      style={styles.matchCard}
      onPress={() => {
        // TODO: Navigate to match details
        console.log('View match:', item.id);
      }}
    >
      <View style={styles.matchHeader}>
        <View style={styles.matchTitleContainer}>
          <Text style={[styles.matchTitle, { color: theme.colors.text }]}>{item.title}</Text>
          <SkillBadge level={item.skillLevel} size="small" />
        </View>
        <Badge
          label={`${item.playersCount}/${item.maxPlayers}`}
          variant={item.playersCount < item.maxPlayers ? 'success' : 'error'}
          size="small"
          icon="account"
        />
      </View>

      <View style={styles.matchDetails}>
        <View style={styles.matchDetail}>
          <Icon name="calendar" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.matchDetailText, { color: theme.colors.textSecondary }]}>
            {item.date} · {item.time}
          </Text>
        </View>
        <View style={styles.matchDetail}>
          <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.matchDetailText, { color: theme.colors.textSecondary }]}>
            {item.court} · {item.distance}
          </Text>
        </View>
        <View style={styles.matchDetail}>
          <Icon name="account" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.matchDetailText, { color: theme.colors.textSecondary }]}>
            Organisé par {item.organizer}
          </Text>
        </View>
      </View>

      <Button
        title={item.playersCount < item.maxPlayers ? 'Rejoindre' : 'Complet'}
        onPress={() => console.log('Join match:', item.id)}
        variant={item.playersCount < item.maxPlayers ? 'primary' : 'secondary'}
        size="small"
        disabled={item.playersCount >= item.maxPlayers}
        icon={item.playersCount < item.maxPlayers ? 'account-plus' : 'close'}
        style={styles.joinButton}
      />
    </Card>
  );

  const renderCourtCard = ({ item }: { item: typeof mockCourts[0] }) => (
    <Card
      variant="outlined"
      padding="medium"
      style={styles.courtCard}
      onPress={() => {
        // TODO: Navigate to court details
        console.log('View court:', item.id);
      }}
    >
      <View style={styles.courtHeader}>
        <View style={styles.courtInfo}>
          <Text style={[styles.courtName, { color: theme.colors.text }]}>{item.name}</Text>
          <View style={styles.courtMeta}>
            <Icon name="star" size={16} color={theme.colors.warning} />
            <Text style={[styles.courtMetaText, { color: theme.colors.text }]}>
              {item.rating}
            </Text>
            <Text style={[styles.courtMetaText, { color: theme.colors.textSecondary }]}>
              ({item.reviewsCount} avis)
            </Text>
          </View>
          <View style={styles.courtMeta}>
            <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.courtMetaText, { color: theme.colors.textSecondary }]}>
              {item.distance}
            </Text>
            <Badge
              label={item.type === 'INDOOR' ? 'Intérieur' : 'Extérieur'}
              variant="info"
              size="small"
              style={styles.courtTypeBadge}
            />
          </View>
        </View>
      </View>

      <View style={styles.courtFooter}>
        <View>
          <Text style={[styles.courtPrice, { color: theme.colors.primary }]}>
            {item.pricePerHour}€/h
          </Text>
          <Text style={[styles.courtAvailability, { color: theme.colors.textSecondary }]}>
            {item.courtsAvailable}/{item.totalCourts} terrains disponibles
          </Text>
        </View>
        <Button
          title="Réserver"
          onPress={() => console.log('Book court:', item.id)}
          variant="primary"
          size="small"
          disabled={item.courtsAvailable === 0}
          icon="calendar-plus"
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Rechercher</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Rechercher ${
            activeTab === 'players' ? 'des joueurs' : activeTab === 'matches' ? 'des matchs' : 'des terrains'
          }...`}
          leftIcon="magnify"
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      {renderTabs()}

      {/* Filters */}
      {(activeTab === 'players' || activeTab === 'matches') && renderFilters()}

      {/* Results */}
      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {activeTab === 'players' && (
          <FlatList
            data={mockPlayers}
            renderItem={renderPlayerCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.resultsList}
          />
        )}

        {activeTab === 'matches' && (
          <FlatList
            data={mockMatches}
            renderItem={renderMatchCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.resultsList}
          />
        )}

        {activeTab === 'courts' && (
          <FlatList
            data={mockCourts}
            renderItem={renderCourtCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.resultsList}
          />
        )}
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filters: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  results: {
    flex: 1,
  },
  resultsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  // Player card styles
  playerCard: {
    marginBottom: 12,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  playerUsername: {
    fontSize: 14,
    marginBottom: 6,
  },
  skillBadge: {
    alignSelf: 'flex-start',
  },
  playerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  playerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerStatText: {
    fontSize: 13,
  },
  // Match card styles
  matchCard: {
    marginBottom: 12,
  },
  matchHeader: {
    marginBottom: 12,
  },
  matchTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  matchDetails: {
    gap: 8,
    marginBottom: 12,
  },
  matchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchDetailText: {
    fontSize: 13,
  },
  joinButton: {
    marginTop: 4,
  },
  // Court card styles
  courtCard: {
    marginBottom: 12,
  },
  courtHeader: {
    marginBottom: 12,
  },
  courtInfo: {
    flex: 1,
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
    marginBottom: 4,
  },
  courtMetaText: {
    fontSize: 13,
  },
  courtTypeBadge: {
    marginLeft: 8,
  },
  courtFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  courtAvailability: {
    fontSize: 12,
  },
});

export default SearchScreen;
