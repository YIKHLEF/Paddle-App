/**
 * Service de gestion complète des matchs
 * Scoring, historique, statistiques, recommandations
 */

import { PrismaClient, MatchType, MatchFormat, MatchStatus, SkillLevel, ParticipantStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateMatchData {
  type: MatchType;
  format: MatchFormat;
  organizerId: string;
  courtId?: string;
  scheduledAt: Date;
  duration?: number;
  requiredLevel?: SkillLevel;
  maxParticipants?: number;
  description?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
}

export interface UpdateMatchData {
  type?: MatchType;
  format?: MatchFormat;
  courtId?: string;
  scheduledAt?: Date;
  duration?: number;
  requiredLevel?: SkillLevel;
  maxParticipants?: number;
  description?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
}

export interface MatchFilters {
  type?: MatchType;
  format?: MatchFormat;
  status?: MatchStatus;
  skillLevel?: SkillLevel;
  city?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  startDate?: Date;
  endDate?: Date;
  organizerId?: string;
  hasSpots?: boolean;
  page?: number;
  limit?: number;
}

export interface MatchScore {
  team1Score: number;
  team2Score: number;
  setNumber: number;
}

export interface CompleteMatchData {
  winnerId?: string;
  scores: MatchScore[];
}

export interface MatchRecommendation {
  matchId: string;
  score: number; // 0-100 compatibility score
  reasons: string[];
}

export class MatchService {
  /**
   * Créer un nouveau match
   */
  static async createMatch(data: CreateMatchData) {
    try {
      const match = await prisma.match.create({
        data: {
          type: data.type,
          format: data.format,
          organizerId: data.organizerId,
          courtId: data.courtId,
          scheduledAt: data.scheduledAt,
          duration: data.duration || 90,
          requiredLevel: data.requiredLevel,
          maxParticipants: data.maxParticipants || (data.format === 'DOUBLES' ? 4 : 2),
          description: data.description,
          visibility: data.visibility || 'PUBLIC',
          status: 'SCHEDULED',
          participants: {
            create: {
              userId: data.organizerId,
              status: 'ACCEPTED',
              team: 1,
            },
          },
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
              club: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                  skillLevel: true,
                },
              },
            },
          },
          scores: true,
        },
      });

      return match;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  /**
   * Récupérer un match par ID
   */
  static async getMatchById(matchId: string, userId?: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
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
              club: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                  skillLevel: true,
                },
              },
            },
          },
          scores: {
            orderBy: { setNumber: 'asc' },
          },
        },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Vérifier si l'utilisateur participe au match
      const isParticipant = userId
        ? match.participants.some((p) => p.userId === userId)
        : false;

      return {
        ...match,
        isParticipant,
        availableSpots: match.maxParticipants - match.participants.filter((p) => p.status === 'ACCEPTED').length,
      };
    } catch (error) {
      console.error('Error getting match:', error);
      throw error;
    }
  }

  /**
   * Rechercher des matchs avec filtres avancés
   */
  static async searchMatches(filters: MatchFilters) {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        status: filters.status || { in: ['SCHEDULED', 'IN_PROGRESS'] },
      };

      if (filters.type) where.type = filters.type;
      if (filters.format) where.format = filters.format;
      if (filters.skillLevel) where.requiredLevel = filters.skillLevel;
      if (filters.organizerId) where.organizerId = filters.organizerId;

      // Date range filter
      if (filters.startDate || filters.endDate) {
        where.scheduledAt = {};
        if (filters.startDate) where.scheduledAt.gte = filters.startDate;
        if (filters.endDate) where.scheduledAt.lte = filters.endDate;
      }

      // Geographic filter avec bounding box
      if (filters.latitude && filters.longitude && filters.radiusKm) {
        const radiusKm = filters.radiusKm;
        const { minLat, maxLat, minLon, maxLon } = this.getBoundingBox(
          filters.latitude,
          filters.longitude,
          radiusKm
        );

        where.court = {
          club: {
            latitude: { gte: minLat, lte: maxLat },
            longitude: { gte: minLon, lte: maxLon },
          },
        };
      }

      const matches = await prisma.match.findMany({
        where,
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
              club: true,
            },
          },
          participants: {
            where: { status: 'ACCEPTED' },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                  skillLevel: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
        skip,
        take: limit,
      });

      // Filter by available spots if requested
      let filteredMatches = matches;
      if (filters.hasSpots) {
        filteredMatches = matches.filter((match) => {
          const acceptedCount = match.participants.length;
          return acceptedCount < match.maxParticipants;
        });
      }

      // Calculate distance for each match if location provided
      if (filters.latitude && filters.longitude) {
        filteredMatches = filteredMatches.map((match) => {
          const distance = match.court?.club
            ? this.calculateDistance(
                filters.latitude!,
                filters.longitude!,
                match.court.club.latitude,
                match.court.club.longitude
              )
            : null;

          return {
            ...match,
            distance,
            availableSpots: match.maxParticipants - match.participants.length,
          };
        });

        // Sort by distance
        filteredMatches.sort((a: any, b: any) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      } else {
        filteredMatches = filteredMatches.map((match) => ({
          ...match,
          availableSpots: match.maxParticipants - match.participants.length,
        }));
      }

      const total = await prisma.match.count({ where });

      return {
        matches: filteredMatches,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error searching matches:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un match
   */
  static async updateMatch(matchId: string, userId: string, data: UpdateMatchData) {
    try {
      // Vérifier que l'utilisateur est l'organisateur
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      if (match.organizerId !== userId) {
        throw new Error('Only the organizer can update the match');
      }

      if (match.status !== 'SCHEDULED') {
        throw new Error('Cannot update a match that has started or ended');
      }

      const updated = await prisma.match.update({
        where: { id: matchId },
        data,
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
              club: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                  skillLevel: true,
                },
              },
            },
          },
        },
      });

      return updated;
    } catch (error) {
      console.error('Error updating match:', error);
      throw error;
    }
  }

  /**
   * Rejoindre un match
   */
  static async joinMatch(matchId: string, userId: string, team?: number) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          participants: {
            where: { status: 'ACCEPTED' },
          },
        },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      if (match.status !== 'SCHEDULED') {
        throw new Error('Cannot join a match that has started or ended');
      }

      const acceptedCount = match.participants.length;
      if (acceptedCount >= match.maxParticipants) {
        throw new Error('Match is full');
      }

      // Vérifier si déjà participant
      const existingParticipant = await prisma.matchParticipant.findUnique({
        where: {
          matchId_userId: {
            matchId,
            userId,
          },
        },
      });

      if (existingParticipant) {
        if (existingParticipant.status === 'ACCEPTED') {
          throw new Error('Already joined this match');
        }
        // Update status to ACCEPTED
        await prisma.matchParticipant.update({
          where: { id: existingParticipant.id },
          data: { status: 'ACCEPTED', team },
        });
      } else {
        // Create new participant
        await prisma.matchParticipant.create({
          data: {
            matchId,
            userId,
            status: 'ACCEPTED',
            team,
          },
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error joining match:', error);
      throw error;
    }
  }

  /**
   * Quitter un match
   */
  static async leaveMatch(matchId: string, userId: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      if (match.organizerId === userId) {
        throw new Error('Organizer cannot leave the match');
      }

      if (match.status !== 'SCHEDULED') {
        throw new Error('Cannot leave a match that has started or ended');
      }

      await prisma.matchParticipant.deleteMany({
        where: {
          matchId,
          userId,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error leaving match:', error);
      throw error;
    }
  }

  /**
   * Démarrer un match
   */
  static async startMatch(matchId: string, userId: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      if (match.organizerId !== userId) {
        throw new Error('Only the organizer can start the match');
      }

      if (match.status !== 'SCHEDULED') {
        throw new Error('Match has already started or ended');
      }

      const updated = await prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error('Error starting match:', error);
      throw error;
    }
  }

  /**
   * Ajouter un score de set
   */
  static async addSetScore(matchId: string, userId: string, score: MatchScore) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          scores: true,
        },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      if (match.organizerId !== userId) {
        throw new Error('Only the organizer can add scores');
      }

      if (match.status !== 'IN_PROGRESS') {
        throw new Error('Match must be in progress to add scores');
      }

      const newScore = await prisma.matchScore.create({
        data: {
          matchId,
          team1Score: score.team1Score,
          team2Score: score.team2Score,
          setNumber: score.setNumber,
        },
      });

      return newScore;
    } catch (error) {
      console.error('Error adding set score:', error);
      throw error;
    }
  }

  /**
   * Terminer un match
   */
  static async completeMatch(matchId: string, userId: string, data: CompleteMatchData) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          participants: {
            where: { status: 'ACCEPTED' },
          },
        },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      if (match.organizerId !== userId) {
        throw new Error('Only the organizer can complete the match');
      }

      if (match.status === 'COMPLETED') {
        throw new Error('Match is already completed');
      }

      // Ajouter les scores
      for (const score of data.scores) {
        await prisma.matchScore.create({
          data: {
            matchId,
            team1Score: score.team1Score,
            team2Score: score.team2Score,
            setNumber: score.setNumber,
          },
        });
      }

      // Mettre à jour le statut du match
      const updated = await prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'COMPLETED',
          endedAt: new Date(),
        },
      });

      // Mettre à jour les statistiques des participants
      await this.updatePlayerStatistics(matchId, data.winnerId);

      return updated;
    } catch (error) {
      console.error('Error completing match:', error);
      throw error;
    }
  }

  /**
   * Annuler un match
   */
  static async cancelMatch(matchId: string, userId: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      if (match.organizerId !== userId) {
        throw new Error('Only the organizer can cancel the match');
      }

      if (match.status === 'COMPLETED') {
        throw new Error('Cannot cancel a completed match');
      }

      const updated = await prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'CANCELLED',
        },
      });

      return updated;
    } catch (error) {
      console.error('Error cancelling match:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'historique des matchs d'un utilisateur
   */
  static async getUserMatchHistory(userId: string, filters?: {
    status?: MatchStatus;
    type?: MatchType;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {
        participants: {
          some: {
            userId,
            status: 'ACCEPTED',
          },
        },
      };

      if (filters?.status) where.status = filters.status;
      if (filters?.type) where.type = filters.type;

      const matches = await prisma.match.findMany({
        where,
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
              club: true,
            },
          },
          participants: {
            where: { status: 'ACCEPTED' },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                  skillLevel: true,
                },
              },
            },
          },
          scores: {
            orderBy: { setNumber: 'asc' },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.match.count({ where });

      return {
        matches,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error getting match history:', error);
      throw error;
    }
  }

  /**
   * Obtenir des recommandations de matchs pour un utilisateur
   */
  static async getMatchRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<MatchRecommendation[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          statistics: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Récupérer les matchs disponibles
      const availableMatches = await prisma.match.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledAt: { gte: new Date() },
          participants: {
            none: { userId },
          },
        },
        include: {
          organizer: true,
          court: {
            include: {
              club: true,
            },
          },
          participants: {
            where: { status: 'ACCEPTED' },
            include: {
              user: {
                include: {
                  statistics: true,
                },
              },
            },
          },
        },
        take: 50, // Limiter pour optimiser le calcul
      });

      // Calculer le score de compatibilité pour chaque match
      const recommendations: MatchRecommendation[] = availableMatches
        .map((match) => {
          let score = 0;
          const reasons: string[] = [];

          // 1. Niveau de compétence (40 points max)
          if (match.requiredLevel) {
            const skillLevels: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'PRO'];
            const userLevelIndex = skillLevels.indexOf(user.skillLevel);
            const requiredLevelIndex = skillLevels.indexOf(match.requiredLevel);
            const levelDiff = Math.abs(userLevelIndex - requiredLevelIndex);

            if (levelDiff === 0) {
              score += 40;
              reasons.push('Niveau de compétence parfaitement adapté');
            } else if (levelDiff === 1) {
              score += 30;
              reasons.push('Niveau de compétence proche');
            } else if (levelDiff === 2) {
              score += 15;
            }
          } else {
            score += 20; // Pas de niveau requis = acceptable
          }

          // 2. Distance (30 points max)
          if (user.latitude && user.longitude && match.court?.club) {
            const distance = this.calculateDistance(
              user.latitude,
              user.longitude,
              match.court.club.latitude,
              match.court.club.longitude
            );

            if (distance <= 5) {
              score += 30;
              reasons.push('Très proche de vous');
            } else if (distance <= 10) {
              score += 20;
              reasons.push('À proximité');
            } else if (distance <= 20) {
              score += 10;
            }
          }

          // 3. Timing (15 points max)
          const now = new Date();
          const hoursDiff = (match.scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

          if (hoursDiff >= 24 && hoursDiff <= 72) {
            score += 15;
            reasons.push('Horaire idéal');
          } else if (hoursDiff >= 12 && hoursDiff <= 168) {
            score += 10;
          }

          // 4. Places disponibles (10 points max)
          const acceptedCount = match.participants.length;
          const availableSpots = match.maxParticipants - acceptedCount;

          if (availableSpots >= 2) {
            score += 10;
            reasons.push('Plusieurs places disponibles');
          } else if (availableSpots === 1) {
            score += 5;
            reasons.push('Dernière place disponible');
          }

          // 5. Type de match (5 points max)
          if (match.type === 'FRIENDLY') {
            score += 5;
            reasons.push('Match amical');
          } else if (match.type === 'RANKED' && user.statistics && user.statistics.totalMatches >= 10) {
            score += 5;
            reasons.push('Match classé pour joueur expérimenté');
          }

          return {
            matchId: match.id,
            score,
            reasons,
          };
        })
        .filter((rec) => rec.score >= 30) // Filtrer les matchs avec score trop faible
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return recommendations;
    } catch (error) {
      console.error('Error getting match recommendations:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les statistiques des joueurs après un match
   */
  private static async updatePlayerStatistics(matchId: string, winnerId?: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          participants: {
            where: { status: 'ACCEPTED' },
          },
        },
      });

      if (!match) return;

      for (const participant of match.participants) {
        const userId = participant.userId;

        // Get or create user statistics
        let stats = await prisma.userStatistics.findUnique({
          where: { userId },
        });

        if (!stats) {
          stats = await prisma.userStatistics.create({
            data: { userId },
          });
        }

        const isWinner = winnerId ? userId === winnerId : false;
        const totalMatches = stats.totalMatches + 1;
        const matchesWon = isWinner ? stats.matchesWon + 1 : stats.matchesWon;
        const matchesLost = !isWinner && winnerId ? stats.matchesLost + 1 : stats.matchesLost;
        const winRate = totalMatches > 0 ? (matchesWon / totalMatches) * 100 : 0;
        const currentStreak = isWinner ? stats.currentStreak + 1 : 0;
        const longestWinStreak = Math.max(stats.longestWinStreak, currentStreak);
        const totalPlayTime = stats.totalPlayTime + (match.duration || 90);

        // Simple ELO calculation (K-factor = 32)
        let eloChange = 0;
        if (winnerId) {
          const K = 32;
          const expectedScore = 0.5; // Simplified, should calculate based on opponent ELO
          const actualScore = isWinner ? 1 : 0;
          eloChange = Math.round(K * (actualScore - expectedScore));
        }

        await prisma.userStatistics.update({
          where: { userId },
          data: {
            totalMatches,
            matchesWon,
            matchesLost,
            winRate,
            currentStreak,
            longestWinStreak,
            totalPlayTime,
            eloScore: stats.eloScore + eloChange,
          },
        });
      }
    } catch (error) {
      console.error('Error updating player statistics:', error);
    }
  }

  /**
   * Calculer la distance entre deux points (formule Haversine)
   */
  private static calculateDistance(
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

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Obtenir une bounding box pour optimiser les requêtes géographiques
   */
  private static getBoundingBox(latitude: number, longitude: number, radiusKm: number) {
    const latDelta = radiusKm / 111.32; // 1 degré de latitude ≈ 111.32 km
    const lonDelta = radiusKm / (111.32 * Math.cos(this.toRadians(latitude)));

    return {
      minLat: latitude - latDelta,
      maxLat: latitude + latDelta,
      minLon: longitude - lonDelta,
      maxLon: longitude + lonDelta,
    };
  }
}
