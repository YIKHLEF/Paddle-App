/**
 * Hook React pour la gestion des tournois
 * Fournit toutes les fonctions nécessaires pour gérer les tournois
 */

import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios.config';
import { getErrorMessage } from '../api/axios.config';

/**
 * Types de tournoi
 */
export enum TournamentType {
  SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
  ROUND_ROBIN = 'ROUND_ROBIN',
}

/**
 * Statut du tournoi
 */
export enum TournamentStatus {
  DRAFT = 'DRAFT',
  REGISTRATION_OPEN = 'REGISTRATION_OPEN',
  REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Format du tournoi
 */
export enum TournamentFormat {
  SINGLES = 'SINGLES',
  DOUBLES = 'DOUBLES',
  MIXED_DOUBLES = 'MIXED_DOUBLES',
}

/**
 * Tournoi
 */
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  organizerId: string;
  organizer?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  clubId?: string;
  type: TournamentType;
  format: TournamentFormat;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  minParticipants?: number;
  participantCount: number;
  requiredSkillLevel?: string;
  entryFee?: number;
  prizes?: any;
  rules?: string;
  status: TournamentStatus;
  championId?: string;
  participants?: TournamentParticipant[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Participant au tournoi
 */
export interface TournamentParticipant {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  skillLevel: string;
  registeredAt: string;
  seed?: number;
  status: string;
}

/**
 * Match de tournoi
 */
export interface TournamentMatch {
  id: string;
  tournamentId: string;
  roundNumber: number;
  matchNumber: number;
  player1?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  player2?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  winnerId?: string;
  score?: any;
  scheduledAt?: string;
  status: string;
  nextMatchId?: string;
  loserNextMatchId?: string;
}

/**
 * Pagination
 */
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Filtres de recherche
 */
export interface TournamentFilters {
  status?: TournamentStatus;
  type?: TournamentType;
  format?: TournamentFormat;
  clubId?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  hasSpots?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Données pour créer un tournoi
 */
export interface CreateTournamentData {
  name: string;
  description?: string;
  clubId?: string;
  type: TournamentType;
  format: TournamentFormat;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  minParticipants?: number;
  requiredSkillLevel?: string;
  entryFee?: number;
  prizes?: any;
  rules?: string;
}

/**
 * Hook useTournament
 */
export const useTournament = (autoLoad: boolean = false) => {
  // État pour les tournois
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [rounds, setRounds] = useState<Record<number, TournamentMatch[]>>({});
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // États de chargement et d'erreur
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  /**
   * Créer un nouveau tournoi
   */
  const createTournament = useCallback(async (data: CreateTournamentData) => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await axios.post<{ success: boolean; tournament: Tournament }>(
        '/tournaments',
        data
      );

      const tournament = response.data.tournament;
      setTournaments((prev) => [tournament, ...prev]);

      return tournament;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur création tournoi:', err);
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * Rechercher des tournois
   */
  const searchTournaments = useCallback(async (filters?: TournamentFilters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        tournaments: Tournament[];
        pagination: Pagination;
      }>('/tournaments/search', {
        params: filters,
      });

      setTournaments(response.data.tournaments);
      setPagination(response.data.pagination);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur recherche tournois:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger un tournoi par ID
   */
  const loadTournamentById = useCallback(async (tournamentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{ success: boolean; tournament: Tournament }>(
        `/tournaments/${tournamentId}`
      );

      setCurrentTournament(response.data.tournament);
      return response.data.tournament;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur chargement tournoi:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger mes tournois
   */
  const loadMyTournaments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{ success: boolean; tournaments: Tournament[] }>(
        '/tournaments/user/me'
      );

      setTournaments(response.data.tournaments);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur chargement mes tournois:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ouvrir les inscriptions
   */
  const openRegistration = useCallback(async (tournamentId: string) => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await axios.post<{ success: boolean; tournament: Tournament }>(
        `/tournaments/${tournamentId}/open-registration`
      );

      const tournament = response.data.tournament;

      // Mettre à jour dans la liste
      setTournaments((prev) =>
        prev.map((t) => (t.id === tournamentId ? tournament : t))
      );

      // Mettre à jour currentTournament
      if (currentTournament?.id === tournamentId) {
        setCurrentTournament(tournament);
      }

      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur ouverture inscriptions:', err);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [currentTournament]);

  /**
   * S'inscrire au tournoi
   */
  const register = useCallback(async (tournamentId: string) => {
    try {
      setActionLoading(true);
      setError(null);

      await axios.post(`/tournaments/${tournamentId}/register`);

      // Recharger le tournoi pour avoir les participants à jour
      await loadTournamentById(tournamentId);

      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur inscription tournoi:', err);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [loadTournamentById]);

  /**
   * Se désinscrire du tournoi
   */
  const unregister = useCallback(async (tournamentId: string) => {
    try {
      setActionLoading(true);
      setError(null);

      await axios.post(`/tournaments/${tournamentId}/unregister`);

      // Recharger le tournoi
      await loadTournamentById(tournamentId);

      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur désinscription tournoi:', err);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [loadTournamentById]);

  /**
   * Démarrer le tournoi
   */
  const startTournament = useCallback(async (tournamentId: string) => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await axios.post<{ success: boolean; tournament: Tournament }>(
        `/tournaments/${tournamentId}/start`
      );

      const tournament = response.data.tournament;

      // Mettre à jour dans la liste
      setTournaments((prev) =>
        prev.map((t) => (t.id === tournamentId ? tournament : t))
      );

      // Mettre à jour currentTournament
      if (currentTournament?.id === tournamentId) {
        setCurrentTournament(tournament);
      }

      // Charger les matchs
      await loadMatches(tournamentId);

      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur démarrage tournoi:', err);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [currentTournament]);

  /**
   * Charger les matchs (bracket)
   */
  const loadMatches = useCallback(async (tournamentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        matches: TournamentMatch[];
        rounds: Record<number, TournamentMatch[]>;
        totalRounds: number;
      }>(`/tournaments/${tournamentId}/matches`);

      setMatches(response.data.matches);
      setRounds(response.data.rounds);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Erreur chargement matchs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Enregistrer le résultat d'un match
   */
  const recordMatchResult = useCallback(
    async (matchId: string, winnerId: string, score?: any) => {
      try {
        setActionLoading(true);
        setError(null);

        await axios.post(`/tournaments/matches/${matchId}/result`, {
          winnerId,
          score,
        });

        // Recharger les matchs
        if (currentTournament) {
          await loadMatches(currentTournament.id);
          await loadTournamentById(currentTournament.id);
        }

        return true;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Erreur enregistrement résultat:', err);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [currentTournament, loadMatches, loadTournamentById]
  );

  /**
   * Charger la page suivante
   */
  const loadMore = useCallback(
    async (filters?: TournamentFilters) => {
      if (!pagination || pagination.page >= pagination.totalPages) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const nextPage = pagination.page + 1;
        const response = await axios.get<{
          success: boolean;
          tournaments: Tournament[];
          pagination: Pagination;
        }>('/tournaments/search', {
          params: {
            ...filters,
            page: nextPage,
          },
        });

        setTournaments((prev) => [...prev, ...response.data.tournaments]);
        setPagination(response.data.pagination);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        console.error('Erreur chargement page suivante:', err);
      } finally {
        setLoading(false);
      }
    },
    [pagination]
  );

  /**
   * Rafraîchir
   */
  const refresh = useCallback(async (filters?: TournamentFilters) => {
    await searchTournaments(filters);
  }, [searchTournaments]);

  /**
   * Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setTournaments([]);
    setCurrentTournament(null);
    setMatches([]);
    setRounds({});
    setPagination(null);
    setError(null);
  }, []);

  // Charger automatiquement si autoLoad
  useEffect(() => {
    if (autoLoad) {
      searchTournaments();
    }
  }, [autoLoad, searchTournaments]);

  return {
    // État
    tournaments,
    currentTournament,
    matches,
    rounds,
    pagination,
    loading,
    actionLoading,
    error,

    // Fonctions de chargement
    searchTournaments,
    loadTournamentById,
    loadMyTournaments,
    loadMatches,
    loadMore,
    refresh,

    // Actions
    createTournament,
    openRegistration,
    register,
    unregister,
    startTournament,
    recordMatchResult,

    // Utilitaires
    reset,

    // Helpers
    hasMore: pagination ? pagination.page < pagination.totalPages : false,
    isEmpty: tournaments.length === 0,
    totalRounds: Object.keys(rounds).length,
    isRegistered: (tournamentId: string, userId: string) => {
      const tournament = tournaments.find((t) => t.id === tournamentId);
      return tournament?.participants?.some((p) => p.userId === userId) || false;
    },
    hasSpots: (tournament: Tournament) => {
      return tournament.participantCount < tournament.maxParticipants;
    },
    canRegister: (tournament: Tournament) => {
      return (
        tournament.status === TournamentStatus.REGISTRATION_OPEN &&
        tournament.participantCount < tournament.maxParticipants &&
        new Date() < new Date(tournament.registrationDeadline)
      );
    },
  };
};

export default useTournament;
