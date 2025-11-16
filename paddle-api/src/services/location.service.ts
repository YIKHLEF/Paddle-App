/**
 * Service de localisation et recherche géographique
 * Gère les recherches basées sur la position et les calculs de distance
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LocationQuery {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export class LocationService {
  /**
   * Calculer la distance entre deux points (formule de Haversine)
   * @returns Distance en kilomètres
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km

    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Calculer la bounding box pour une recherche dans un rayon
   */
  static getBoundingBox(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } {
    const earthRadiusKm = 6371;
    const latRadian = this.toRadians(latitude);

    // Calculer les deltas en degrés
    const latDelta = (radiusKm / earthRadiusKm) * (180 / Math.PI);
    const lngDelta =
      (radiusKm / (earthRadiusKm * Math.cos(latRadian))) * (180 / Math.PI);

    return {
      minLat: latitude - latDelta,
      maxLat: latitude + latDelta,
      minLng: longitude - lngDelta,
      maxLng: longitude + lngDelta,
    };
  }

  /**
   * Rechercher des joueurs à proximité
   */
  static async findNearbyPlayers(query: LocationQuery, options?: {
    skillLevel?: string;
    limit?: number;
    excludeUserId?: string;
  }) {
    try {
      const { minLat, maxLat, minLng, maxLng } = this.getBoundingBox(
        query.latitude,
        query.longitude,
        query.radiusKm
      );

      // Recherche dans la bounding box
      const players = await prisma.user.findMany({
        where: {
          latitude: {
            gte: minLat,
            lte: maxLat,
          },
          longitude: {
            gte: minLng,
            lte: maxLng,
          },
          ...(options?.skillLevel && { skillLevel: options.skillLevel }),
          ...(options?.excludeUserId && { id: { not: options.excludeUserId } }),
          isActive: true,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatarUrl: true,
          skillLevel: true,
          preferredPosition: true,
          latitude: true,
          longitude: true,
          location: true,
        },
        take: options?.limit || 50,
      });

      // Filtrer par distance exacte et calculer la distance
      const playersWithDistance = players
        .map((player) => {
          const distance = this.calculateDistance(
            query.latitude,
            query.longitude,
            player.latitude!,
            player.longitude!
          );

          return {
            ...player,
            distance,
          };
        })
        .filter((player) => player.distance <= query.radiusKm)
        .sort((a, b) => a.distance - b.distance);

      return playersWithDistance;
    } catch (error) {
      console.error('Error finding nearby players:', error);
      throw error;
    }
  }

  /**
   * Rechercher des clubs à proximité
   */
  static async findNearbyClubs(query: LocationQuery, options?: {
    limit?: number;
    hasAvailableCourts?: boolean;
  }) {
    try {
      const { minLat, maxLat, minLng, maxLng } = this.getBoundingBox(
        query.latitude,
        query.longitude,
        query.radiusKm
      );

      const clubs = await prisma.club.findMany({
        where: {
          latitude: {
            gte: minLat,
            lte: maxLat,
          },
          longitude: {
            gte: minLng,
            lte: maxLng,
          },
        },
        include: {
          courts: {
            where: {
              isActive: true,
            },
          },
        },
        take: options?.limit || 50,
      });

      // Filtrer par distance exacte et calculer la distance
      const clubsWithDistance = clubs
        .map((club) => {
          const distance = this.calculateDistance(
            query.latitude,
            query.longitude,
            club.latitude,
            club.longitude
          );

          const availableCourts = club.courts.length;

          return {
            ...club,
            distance,
            availableCourts,
          };
        })
        .filter((club) => {
          if (club.distance > query.radiusKm) return false;
          if (options?.hasAvailableCourts && club.availableCourts === 0) return false;
          return true;
        })
        .sort((a, b) => a.distance - b.distance);

      return clubsWithDistance;
    } catch (error) {
      console.error('Error finding nearby clubs:', error);
      throw error;
    }
  }

  /**
   * Rechercher des terrains à proximité
   */
  static async findNearbyCourts(query: LocationQuery, options?: {
    type?: 'INDOOR' | 'OUTDOOR';
    limit?: number;
    date?: Date;
  }) {
    try {
      const { minLat, maxLat, minLng, maxLng } = this.getBoundingBox(
        query.latitude,
        query.longitude,
        query.radiusKm
      );

      const courts = await prisma.court.findMany({
        where: {
          club: {
            latitude: {
              gte: minLat,
              lte: maxLat,
            },
            longitude: {
              gte: minLng,
              lte: maxLng,
            },
          },
          isActive: true,
          ...(options?.type && { type: options.type }),
        },
        include: {
          club: {
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true,
              address: true,
              city: true,
              photos: true,
              averageRating: true,
            },
          },
        },
        take: options?.limit || 50,
      });

      // Calculer la distance pour chaque terrain
      const courtsWithDistance = courts
        .map((court) => {
          const distance = this.calculateDistance(
            query.latitude,
            query.longitude,
            court.club.latitude,
            court.club.longitude
          );

          return {
            ...court,
            distance,
          };
        })
        .filter((court) => court.distance <= query.radiusKm)
        .sort((a, b) => a.distance - b.distance);

      return courtsWithDistance;
    } catch (error) {
      console.error('Error finding nearby courts:', error);
      throw error;
    }
  }

  /**
   * Rechercher des matchs à proximité
   */
  static async findNearbyMatches(query: LocationQuery, options?: {
    skillLevel?: string;
    type?: string;
    limit?: number;
    excludeUserId?: string;
  }) {
    try {
      const { minLat, maxLat, minLng, maxLng } = this.getBoundingBox(
        query.latitude,
        query.longitude,
        query.radiusKm
      );

      const matches = await prisma.match.findMany({
        where: {
          court: {
            club: {
              latitude: {
                gte: minLat,
                lte: maxLat,
              },
              longitude: {
                gte: minLng,
                lte: maxLng,
              },
            },
          },
          status: 'SCHEDULED',
          visibility: 'PUBLIC',
          scheduledAt: {
            gte: new Date(),
          },
          ...(options?.skillLevel && { requiredLevel: options.skillLevel }),
          ...(options?.type && { type: options.type }),
        },
        include: {
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
              skillLevel: true,
            },
          },
          court: {
            include: {
              club: {
                select: {
                  name: true,
                  latitude: true,
                  longitude: true,
                  address: true,
                  city: true,
                },
              },
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        take: options?.limit || 50,
      });

      // Filtrer par distance et exclure les matchs où l'utilisateur participe déjà
      const matchesWithDistance = matches
        .map((match) => {
          const distance = this.calculateDistance(
            query.latitude,
            query.longitude,
            match.court!.club.latitude,
            match.court!.club.longitude
          );

          const isParticipant = match.participants.some(
            (p) => p.userId === options?.excludeUserId
          );

          return {
            ...match,
            distance,
            isParticipant,
          };
        })
        .filter((match) => {
          if (match.distance > query.radiusKm) return false;
          if (match.isParticipant) return false;
          return true;
        })
        .sort((a, b) => a.distance - b.distance);

      return matchesWithDistance;
    } catch (error) {
      console.error('Error finding nearby matches:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la position d'un utilisateur
   */
  static async updateUserLocation(
    userId: string,
    latitude: number,
    longitude: number,
    location?: string
  ) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          latitude,
          longitude,
          ...(location && { location }),
          lastActiveAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error('Error updating user location:', error);
      return false;
    }
  }

  /**
   * Obtenir des statistiques géographiques
   */
  static async getLocationStats(latitude: number, longitude: number, radiusKm: number) {
    try {
      const [players, clubs, matches] = await Promise.all([
        this.findNearbyPlayers({ latitude, longitude, radiusKm }),
        this.findNearbyClubs({ latitude, longitude, radiusKm }),
        this.findNearbyMatches({ latitude, longitude, radiusKm }),
      ]);

      return {
        playersCount: players.length,
        clubsCount: clubs.length,
        matchesCount: matches.length,
        averageDistance: {
          players:
            players.length > 0
              ? players.reduce((sum, p) => sum + p.distance, 0) / players.length
              : 0,
          clubs:
            clubs.length > 0
              ? clubs.reduce((sum, c) => sum + c.distance, 0) / clubs.length
              : 0,
          matches:
            matches.length > 0
              ? matches.reduce((sum, m) => sum + m.distance, 0) / matches.length
              : 0,
        },
      };
    } catch (error) {
      console.error('Error getting location stats:', error);
      throw error;
    }
  }

  /**
   * Convertir degrés en radians
   */
  private static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
