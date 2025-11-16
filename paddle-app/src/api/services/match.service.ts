/**
 * Service API pour les matchs
 * Gère la création, modification, recherche et participation aux matchs
 */

import axios from '../axios.config';

/**
 * Match complet
 */
export interface Match {
  id: string;
  title: string;
  description?: string | null;
  type: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT';
  format: 'SINGLES' | 'DOUBLES';
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dateTime: string;
  duration: number; // en minutes
  court: {
    id: string;
    name: string;
    clubName: string;
    address?: string | null;
  };
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string | null;
  };
  participants: Array<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string | null;
    status: 'CONFIRMED' | 'PENDING' | 'DECLINED';
  }>;
  maxPlayers: number;
  price?: number | null;
  isPrivate: boolean;
  score?: {
    team1: number[];
    team2: number[];
  } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Données pour créer un match
 */
export interface CreateMatchData {
  title: string;
  description?: string;
  type: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT';
  format: 'SINGLES' | 'DOUBLES';
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  dateTime: string; // ISO format
  duration: number; // en minutes
  courtId: string;
  maxPlayers: number;
  price?: number;
  isPrivate?: boolean;
}

/**
 * Données pour mettre à jour un match
 */
export interface UpdateMatchData {
  title?: string;
  description?: string;
  type?: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT';
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  dateTime?: string;
  duration?: number;
  price?: number;
  isPrivate?: boolean;
}

/**
 * Paramètres de recherche de matchs
 */
export interface SearchMatchesParams {
  type?: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT';
  format?: 'SINGLES' | 'DOUBLES';
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // en km
  dateFrom?: string; // ISO format
  dateTo?: string; // ISO format
  minPrice?: number;
  maxPrice?: number;
  onlyAvailable?: boolean; // Matchs avec places disponibles
  page?: number;
  limit?: number;
}

/**
 * Résultat de recherche de matchs
 */
export interface SearchMatchesResult {
  matches: Array<Match>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Score d'un match
 */
export interface MatchScore {
  team1: number[];
  team2: number[];
  winner?: 'TEAM1' | 'TEAM2' | 'DRAW';
}

/**
 * Service de gestion des matchs
 */
export const matchService = {
  /**
   * Récupérer tous les matchs avec filtres
   */
  async getMatches(params: SearchMatchesParams): Promise<SearchMatchesResult> {
    const response = await axios.get<SearchMatchesResult>('/matches', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer un match par ID
   */
  async getMatchById(matchId: string): Promise<Match> {
    const response = await axios.get<Match>(`/matches/${matchId}`);
    return response.data;
  },

  /**
   * Créer un nouveau match
   */
  async createMatch(data: CreateMatchData): Promise<Match> {
    const response = await axios.post<Match>('/matches', data);
    return response.data;
  },

  /**
   * Mettre à jour un match
   */
  async updateMatch(
    matchId: string,
    data: UpdateMatchData
  ): Promise<Match> {
    const response = await axios.put<Match>(`/matches/${matchId}`, data);
    return response.data;
  },

  /**
   * Supprimer un match
   */
  async deleteMatch(matchId: string): Promise<void> {
    await axios.delete(`/matches/${matchId}`);
  },

  /**
   * Rejoindre un match
   */
  async joinMatch(matchId: string): Promise<Match> {
    const response = await axios.post<Match>(`/matches/${matchId}/join`);
    return response.data;
  },

  /**
   * Quitter un match
   */
  async leaveMatch(matchId: string): Promise<Match> {
    const response = await axios.post<Match>(`/matches/${matchId}/leave`);
    return response.data;
  },

  /**
   * Inviter un joueur à un match
   */
  async invitePlayer(matchId: string, userId: string): Promise<void> {
    await axios.post(`/matches/${matchId}/invite`, { userId });
  },

  /**
   * Répondre à une invitation
   */
  async respondToInvitation(
    matchId: string,
    response: 'ACCEPT' | 'DECLINE'
  ): Promise<Match> {
    const res = await axios.post<Match>(
      `/matches/${matchId}/invitation/respond`,
      { response }
    );
    return res.data;
  },

  /**
   * Récupérer les matchs auxquels je participe
   */
  async getMyMatches(params?: {
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    page?: number;
    limit?: number;
  }): Promise<SearchMatchesResult> {
    const response = await axios.get<SearchMatchesResult>('/matches/my', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer les matchs que j'ai organisés
   */
  async getMyOrganizedMatches(params?: {
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    page?: number;
    limit?: number;
  }): Promise<SearchMatchesResult> {
    const response = await axios.get<SearchMatchesResult>(
      '/matches/my/organized',
      { params }
    );
    return response.data;
  },

  /**
   * Mettre à jour le score d'un match
   */
  async updateScore(matchId: string, score: MatchScore): Promise<Match> {
    const response = await axios.put<Match>(`/matches/${matchId}/score`, score);
    return response.data;
  },

  /**
   * Marquer un match comme terminé
   */
  async completeMatch(matchId: string): Promise<Match> {
    const response = await axios.post<Match>(`/matches/${matchId}/complete`);
    return response.data;
  },

  /**
   * Annuler un match
   */
  async cancelMatch(matchId: string, reason?: string): Promise<Match> {
    const response = await axios.post<Match>(`/matches/${matchId}/cancel`, {
      reason,
    });
    return response.data;
  },
};
