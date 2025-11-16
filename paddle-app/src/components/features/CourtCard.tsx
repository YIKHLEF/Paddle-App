/**
 * Composant CourtCard
 * Carte d'affichage d'un terrain
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardHeader, CardContent, CardFooter, Badge, Button } from '@/components/common';

export interface CourtCardData {
  id: string;
  name: string;
  clubName: string;
  type: 'INDOOR' | 'OUTDOOR';
  surface: 'ARTIFICIAL_GRASS' | 'CONCRETE' | 'GLASS';
  pricePerHour: number;
  distance?: string;
  rating?: number;
  reviewsCount?: number;
  courtsAvailable?: number;
  totalCourts?: number;
  hasLighting?: boolean;
  hasParking?: boolean;
  hasShower?: boolean;
  imageUrl?: string | null;
}

interface CourtCardProps {
  court: CourtCardData;
  onPress?: () => void;
  onBookPress?: () => void;
  variant?: 'default' | 'compact';
  style?: ViewStyle;
}

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  onPress,
  onBookPress,
  variant = 'default',
  style,
}) => {
  const theme = useTheme();

  const isAvailable = court.courtsAvailable ? court.courtsAvailable > 0 : true;

  const getSurfaceLabel = () => {
    switch (court.surface) {
      case 'ARTIFICIAL_GRASS': return 'Gazon synthétique';
      case 'CONCRETE': return 'Béton';
      case 'GLASS': return 'Verre';
      default: return court.surface;
    }
  };

  if (variant === 'compact') {
    return (
      <Card variant="outlined" padding="medium" onPress={onPress} style={style} testID="court-card">
        <View style={styles.compactContainer}>
          <View style={styles.compactLeft}>
            <Text style={[styles.compactName, { color: theme.colors.text }]} numberOfLines={1}>
              {court.name}
            </Text>
            <View style={styles.compactMeta}>
              {court.distance && (
                <>
                  <Icon name="map-marker" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.compactMetaText, { color: theme.colors.textSecondary }]}>
                    {court.distance}
                  </Text>
                </>
              )}
              <Text style={[styles.compactPrice, { color: theme.colors.primary }]}>
                {court.pricePerHour}€/h
              </Text>
            </View>
          </View>
          <Badge
            label={isAvailable ? 'Disponible' : 'Complet'}
            variant={isAvailable ? 'success' : 'error'}
            size="small"
          />
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
      testID="court-card"
    >
      <CardHeader>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {court.name}
            </Text>
            <Text style={[styles.clubName, { color: theme.colors.textSecondary }]}>
              {court.clubName}
            </Text>
          </View>
          <Badge
            label={isAvailable ? 'Disponible' : 'Complet'}
            variant={isAvailable ? 'success' : 'error'}
            size="small"
          />
        </View>
      </CardHeader>

      <CardContent>
        {/* Rating & Distance */}
        <View style={styles.meta}>
          {court.rating !== undefined && (
            <View style={styles.metaItem}>
              <Icon name="star" size={16} color={theme.colors.warning} />
              <Text style={[styles.metaText, { color: theme.colors.text }]}>
                {court.rating.toFixed(1)}
              </Text>
              {court.reviewsCount !== undefined && (
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  ({court.reviewsCount} avis)
                </Text>
              )}
            </View>
          )}
          {court.distance && (
            <View style={styles.metaItem}>
              <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {court.distance}
              </Text>
            </View>
          )}
        </View>

        {/* Court Details */}
        <View style={styles.details}>
          <Badge
            label={court.type === 'INDOOR' ? 'Intérieur' : 'Extérieur'}
            variant="info"
            size="small"
            icon={court.type === 'INDOOR' ? 'home' : 'weather-sunny'}
          />
          <Badge
            label={getSurfaceLabel()}
            variant="secondary"
            size="small"
          />
        </View>

        {/* Facilities */}
        {(court.hasLighting || court.hasParking || court.hasShower) && (
          <View style={styles.facilities}>
            <Text style={[styles.facilitiesLabel, { color: theme.colors.textSecondary }]}>
              Équipements :
            </Text>
            <View style={styles.facilitiesIcons}>
              {court.hasLighting && (
                <Icon name="lightbulb" size={20} color={theme.colors.primary} />
              )}
              {court.hasParking && (
                <Icon name="parking" size={20} color={theme.colors.primary} />
              )}
              {court.hasShower && (
                <Icon name="shower" size={20} color={theme.colors.primary} />
              )}
            </View>
          </View>
        )}

        {/* Availability */}
        {court.courtsAvailable !== undefined && court.totalCourts !== undefined && (
          <View style={styles.availability}>
            <Icon name="tennis" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.availabilityText, { color: theme.colors.textSecondary }]}>
              {court.courtsAvailable}/{court.totalCourts} terrains disponibles
            </Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.price}>
          <Text style={[styles.priceAmount, { color: theme.colors.primary }]}>
            {court.pricePerHour}€
          </Text>
          <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
            par heure
          </Text>
        </View>
      </CardContent>

      {onBookPress && (
        <CardFooter>
          <Button
            title={isAvailable ? 'Réserver' : 'Indisponible'}
            onPress={onBookPress}
            variant="primary"
            size="small"
            disabled={!isAvailable}
            icon="calendar-plus"
            fullWidth
          />
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
  compactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactMetaText: {
    fontSize: 13,
    marginRight: 8,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  clubName: {
    fontSize: 14,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  details: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  facilities: {
    marginBottom: 12,
  },
  facilitiesLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  facilitiesIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  availabilityText: {
    fontSize: 13,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: 13,
  },
});

export default CourtCard;
