/**
 * Composant PlayerCard
 * Carte d'affichage d'un joueur
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, Avatar, SkillBadge, Button } from '@/components/common';

export interface PlayerCardData {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  profilePicture?: string | null;
  distance?: string;
  matchesPlayed?: number;
  winRate?: number;
  isOnline?: boolean;
}

interface PlayerCardProps {
  player: PlayerCardData;
  onPress?: () => void;
  onMessagePress?: () => void;
  onInvitePress?: () => void;
  variant?: 'default' | 'compact';
  style?: ViewStyle;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onPress,
  onMessagePress,
  onInvitePress,
  variant = 'default',
  style,
}) => {
  const theme = useTheme();

  if (variant === 'compact') {
    return (
      <Card variant="outlined" padding="medium" onPress={onPress} style={style} testID="player-card">
        <View style={styles.compactContainer}>
          <Avatar
            uri={player.profilePicture}
            name={`${player.firstName} ${player.lastName}`}
            size="md"
            variant="circular"
            badge={player.isOnline}
            badgeColor={theme.colors.success}
          />
          <View style={styles.compactInfo}>
            <Text style={[styles.compactName, { color: theme.colors.text }]}>
              {player.firstName} {player.lastName}
            </Text>
            <SkillBadge level={player.skillLevel} size="small" />
          </View>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </View>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      padding="medium"
      onPress={onPress}
      style={style}
      testID="player-card"
    >
      <CardContent>
        {/* Header */}
        <View style={styles.header}>
          <Avatar
            uri={player.profilePicture}
            name={`${player.firstName} ${player.lastName}`}
            size="lg"
            variant="circular"
            badge={player.isOnline}
            badgeColor={theme.colors.success}
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {player.firstName} {player.lastName}
            </Text>
            <Text style={[styles.username, { color: theme.colors.textSecondary }]}>
              @{player.username}
            </Text>
            <SkillBadge level={player.skillLevel} size="small" style={styles.skillBadge} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          {player.distance && (
            <View style={styles.stat}>
              <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {player.distance}
              </Text>
            </View>
          )}
          {player.matchesPlayed !== undefined && (
            <View style={styles.stat}>
              <Icon name="tennis" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {player.matchesPlayed} matchs
              </Text>
            </View>
          )}
          {player.winRate !== undefined && (
            <View style={styles.stat}>
              <Icon name="trophy" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {player.winRate}% victoires
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {(onMessagePress || onInvitePress) && (
          <View style={styles.actions}>
            {onMessagePress && (
              <Button
                title="Message"
                onPress={onMessagePress}
                variant="outline"
                size="small"
                icon="message-text"
                style={styles.actionButton}
              />
            )}
            {onInvitePress && (
              <Button
                title="Inviter"
                onPress={onInvitePress}
                variant="primary"
                size="small"
                icon="account-plus"
                style={styles.actionButton}
              />
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compactInfo: {
    flex: 1,
    gap: 6,
  },
  compactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    marginBottom: 8,
  },
  skillBadge: {
    alignSelf: 'flex-start',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});

export default PlayerCard;
