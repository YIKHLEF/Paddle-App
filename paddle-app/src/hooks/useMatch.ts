/**
 * Hook React pour la gestion complète des matchs
 * Scoring, historique, statistiques, recommandations
 */

import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios.config';

export interface Match {
  id: string;
  type: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT' | 'DISCOVERY';
  format: 'SINGLES' | 'DOUBLES';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';

  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string | null;
    skillLevel: string;
  };

  court?: {
    id: string;
    name: string;
    courtNumber: number;
    type: 'INDOOR' | 'OUTDOOR';
    club: {
      id: string;
      name: string;
      address: string;
      city: string;
      latitude: number;
      longitude: number;
    };
  };

  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;

  requiredLevel?: string;
  maxParticipants: number;
  description?: string;

  participants: Array<{
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CHECKED_IN';
    team?: number;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      avatarUrl: string | null;
      skillLevel: string;
    };
  }>;

  scores: Array<{
    id: string;
    team1Score: number;
    team2Score: number;
    setNumber: number;
  }>;

  isParticipant?: boolean;
  availableSpots?: number;
  distance?: number;
}

export interface MatchScore {
  team1Score: number;
  team2Score: number;
  setNumber: number;
}

export interface CreateMatchData {
  type: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT' | 'DISCOVERY';
  format: 'SINGLES' | 'DOUBLES';
  courtId?: string;
  scheduledAt: Date;
  duration?: number;
  requiredLevel?: string;
  maxParticipants?: number;
  description?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
}

export interface MatchFilters {
  type?: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT' | 'DISCOVERY';
  format?: 'SINGLES' | 'DOUBLES';
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  skillLevel?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  hasSpots?: boolean;
  page?: number;
  limit?: number;
}

export interface MatchRecommendation {
  matchId: string;
  score: number;
  reasons: string[];
}

export const useMatch = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [recommendations, setRecommendations] = useState<MatchRecommendation[]>([]);
  const [history, setHistory] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  /**
   * Créer un nouveau match
   */
  const createMatch = useCallback(async (data: CreateMatchData): Promise<Match> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<{ success: boolean; match: Match }>('/matches', {
        ...data,
        scheduledAt: data.scheduledAt.toISOString(),
      });

      const newMatch = response.data.match;
      setMatches((prev) => [newMatch, ...prev]);

      return newMatch;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la création du match';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rechercher des matchs avec filtres
   */
  const searchMatches = useCallback(async (filters: MatchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{
        success: boolean;
        matches: Match[];
        pagination: typeof pagination;
      }>(`/matches/search?${params.toString()}`);

      setMatches(response.data.matches);
      setPagination(response.data.pagination);

      return response.data.matches;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la recherche';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer un match par ID
   */
  const getMatchById = useCallback(async (matchId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{ success: boolean; match: Match }>(`/matches/${matchId}`);
      const match = response.data.match;

      setCurrentMatch(match);
      return match;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du chargement du match';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mettre à jour un match
   */
  const updateMatch = useCallback(async (matchId: string, data: Partial<CreateMatchData>) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
        scheduledAt: data.scheduledAt ? data.scheduledAt.toISOString() : undefined,
      };

      const response = await axios.put<{ success: boolean; match: Match }>(
        `/matches/${matchId}`,
        payload
      );

      const updatedMatch = response.data.match;
      setCurrentMatch(updatedMatch);
      setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));

      return updatedMatch;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rejoindre un match
   */
  const joinMatch = useCallback(async (matchId: string, team?: number) => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(`/matches/${matchId}/join`, { team });

      // Recharger le match pour avoir les infos à jour
      await getMatchById(matchId);

      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getMatchById]);

  /**
   * Quitter un match
   */
  const leaveMatch = useCallback(async (matchId: string) => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(`/matches/${matchId}/leave`);

      // Recharger le match pour avoir les infos à jour
      await getMatchById(matchId);

      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du départ';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getMatchById]);

  /**
   * Démarrer un match
   */
  const startMatch = useCallback(async (matchId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<{ success: boolean; match: Match }>(
        `/matches/${matchId}/start`
      );

      const startedMatch = response.data.match;
      setCurrentMatch(startedMatch);

      return startedMatch;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du démarrage';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ajouter un score de set
   */
  const addSetScore = useCallback(async (matchId: string, score: MatchScore) => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(`/matches/${matchId}/score`, score);

      // Recharger le match pour avoir les scores à jour
      await getMatchById(matchId);

      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'ajout du score';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getMatchById]);

  /**
   * Terminer un match
   */
  const completeMatch = useCallback(
    async (matchId: string, winnerId?: string, scores?: MatchScore[]) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post<{ success: boolean; match: Match }>(
          `/matches/${matchId}/complete`,
          {
            winnerId,
            scores: scores || [],
          }
        );

        const completedMatch = response.data.match;
        setCurrentMatch(completedMatch);

        return completedMatch;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erreur lors de la clôture du match';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Annuler un match
   */
  const cancelMatch = useCallback(async (matchId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<{ success: boolean; match: Match }>(
        `/matches/${matchId}/cancel`
      );

      const cancelledMatch = response.data.match;
      setCurrentMatch(cancelledMatch);
      setMatches((prev) => prev.map((m) => (m.id === matchId ? cancelledMatch : m)));

      return cancelledMatch;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer l'historique des matchs
   */
  const getUserMatchHistory = useCallback(
    async (filters?: {
      status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
      type?: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT' | 'DISCOVERY';
      page?: number;
      limit?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, value.toString());
            }
          });
        }

        const response = await axios.get<{
          success: boolean;
          matches: Match[];
          pagination: typeof pagination;
        }>(`/matches/user/history?${params.toString()}`);

        setHistory(response.data.matches);
        setPagination(response.data.pagination);

        return response.data.matches;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erreur lors du chargement de l\'historique';
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Obtenir des recommandations de matchs
   */
  const getMatchRecommendations = useCallback(async (limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        recommendations: MatchRecommendation[];
      }>(`/matches/user/recommendations?limit=${limit}`);

      setRecommendations(response.data.recommendations);

      return response.data.recommendations;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du chargement des recommandations';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger plus de matchs (pagination)
   */
  const loadMore = useCallback(
    async (filters: MatchFilters = {}) => {
      if (pagination.page >= pagination.totalPages) {
        return;
      }

      const nextPage = pagination.page + 1;
      const newMatches = await searchMatches({
        ...filters,
        page: nextPage,
      });

      setMatches((prev) => [...prev, ...newMatches]);
    },
    [pagination, searchMatches]
  );

  /**
   * Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setMatches([]);
    setCurrentMatch(null);
    setRecommendations([]);
    setHistory([]);
    setError(null);
    setPagination({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });
  }, []);

  return {
    // État
    matches,
    currentMatch,
    recommendations,
    history,
    loading,
    error,
    pagination,

    // Actions
    createMatch,
    searchMatches,
    getMatchById,
    updateMatch,
    joinMatch,
    leaveMatch,
    startMatch,
    addSetScore,
    completeMatch,
    cancelMatch,
    getUserMatchHistory,
    getMatchRecommendations,
    loadMore,
    reset,
  };
};
