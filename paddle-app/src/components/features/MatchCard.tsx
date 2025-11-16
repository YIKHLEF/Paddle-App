/**
 * Composant MatchCard
 * Carte d'affichage d'un match
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardHeader, CardContent, CardFooter, Badge, SkillBadge, AvatarGroup, Button } from '@/components/common';

export interface MatchCardData {
  id: string;
  title: string;
  type: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT';
  format: 'SINGLES' | 'DOUBLES';
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  date: string;
  time: string;
  court: string;
  courtLocation?: string;
  organizer: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string | null;
  }>;
  maxPlayers: number;
  distance?: string;
  price?: number;
}

interface MatchCardProps {
  match: MatchCardData;
  onPress?: () => void;
  onJoinPress?: () => void;
  onLeavePress?: () => void;
  isJoined?: boolean;
  variant?: 'default' | 'compact';
  style?: ViewStyle;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onPress,
  onJoinPress,
  onLeavePress,
  isJoined = false,
  variant = 'default',
  style,
}) => {
  const theme = useTheme();

  const isFull = match.participants.length >= match.maxPlayers;
  const spotsLeft = match.maxPlayers - match.participants.length;

  const getTypeLabel = () => {
    switch (match.type) {
      case 'FRIENDLY': return 'Amical';
      case 'RANKED': return 'Classé';
      case 'TRAINING': return 'Entraînement';
      case 'TOURNAMENT': return 'Tournoi';
      default: return match.type;
    }
  };

  const getTypeColor = () => {
    switch (match.type) {
      case 'FRIENDLY': return 'primary';
      case 'RANKED': return 'warning';
      case 'TRAINING': return 'info';
      case 'TOURNAMENT': return 'secondary';
      default: return 'primary';
    }
  };

  if (variant === 'compact') {
    return (
      <Card variant="outlined" padding="medium" onPress={onPress} style={style}>
        <View style={styles.compactContainer}>
          <View style={styles.compactLeft}>
            <View style={styles.compactHeader}>
              <Text style={[styles.compactTitle, { color: theme.colors.text }]} numberOfLines={1}>
                {match.title}
              </Text>
              <Badge
                label={`${match.participants.length}/${match.maxPlayers}`}
                variant={isFull ? 'error' : 'success'}
                size="small"
                icon="account"
              />
            </View>
            <Text style={[styles.compactTime, { color: theme.colors.textSecondary }]}>
              {match.date} · {match.time}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </View>
      </Card>
    );
  }

  return (
    <Card
      variant="elevated"
      padding="medium"
      onPress={onPress}
      style={style}
      testID="match-card"
    >
      <CardHeader>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {match.title}
            </Text>
            <View style={styles.badges}>
              <Badge
                label={getTypeLabel()}
                variant={getTypeColor() as any}
                size="small"
              />
              <SkillBadge level={match.skillLevel} size="small" />
            </View>
          </View>
          <Badge
            label={`${match.participants.length}/${match.maxPlayers}`}
            variant={isFull ? 'error' : 'success'}
            size="small"
            icon="account"
          />
        </View>
      </CardHeader>

      <CardContent>
        {/* Match Details */}
        <View style={styles.details}>
          <View style={styles.detail}>
            <Icon name="calendar" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {match.date} · {match.time}
            </Text>
          </View>
          <View style={styles.detail}>
            <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {match.court}
              {match.distance && ` · ${match.distance}`}
            </Text>
          </View>
          <View style={styles.detail}>
            <Icon name="account" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              Organisé par {match.organizer}
            </Text>
          </View>
          {match.price !== undefined && (
            <View style={styles.detail}>
              <Icon name="currency-eur" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.primary }]}>
                {match.price}€ par personne
              </Text>
            </View>
          )}
        </View>

        {/* Participants */}
        {match.participants.length > 0 && (
          <View style={styles.participants}>
            <Text style={[styles.participantsLabel, { color: theme.colors.textSecondary }]}>
              Participants :
            </Text>
            <AvatarGroup
              avatars={match.participants.map(p => ({
                id: p.id,
                name: p.name,
                uri: p.avatar,
              }))}
              max={4}
              size="sm"
            />
          </View>
        )}
      </CardContent>

      {(onJoinPress || onLeavePress) && (
        <CardFooter>
          {isJoined ? (
            <Button
              title="Quitter le match"
              onPress={onLeavePress}
              variant="danger"
              size="small"
              icon="exit-run"
              fullWidth
            />
          ) : (
            <Button
              title={isFull ? 'Complet' : `Rejoindre (${spotsLeft} place${spotsLeft > 1 ? 's' : ''})`}
              onPress={onJoinPress}
              variant={isFull ? 'secondary' : 'primary'}
              size="small"
              disabled={isFull}
              icon={isFull ? 'close' : 'account-plus'}
              fullWidth
            />
          )}
        </CardFooter>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactLeft: {
    flex: 1,
    marginRight: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  compactTime: {
    fontSize: 13,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  details: {
    gap: 8,
    marginBottom: 16,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  participantsLabel: {
    fontSize: 12,
  },
});

export default MatchCard;
