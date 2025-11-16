/**
 * Service API pour les utilisateurs
 * Gère le profil utilisateur, la recherche de joueurs, et les statistiques
 */

import axios from '../axios.config';

/**
 * Profil utilisateur complet
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  preferredPosition?: 'LEFT' | 'RIGHT' | 'BOTH' | null;
  dominantHand?: 'LEFT' | 'RIGHT' | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  subscriptionTier: 'FREE' | 'STANDARD' | 'PREMIUM';
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Données pour mettre à jour le profil
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  preferredPosition?: 'LEFT' | 'RIGHT' | 'BOTH';
  dominantHand?: 'LEFT' | 'RIGHT';
  city?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Statistiques utilisateur
 */
export interface UserStatistics {
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  winRate: number;
  totalSets: number;
  setsWon: number;
  setsLost: number;
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  longestStreak: number;
  favoritePartners: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    matchesTogether: number;
  }>;
  recentMatches: Array<{
    id: string;
    date: string;
    result: 'WON' | 'LOST';
    score: string;
  }>;
}

/**
 * Paramètres de recherche de joueurs
 */
export interface SearchPlayersParams {
  query?: string;
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // en km
  page?: number;
  limit?: number;
}

/**
 * Résultat de recherche de joueurs
 */
export interface SearchPlayersResult {
  players: Array<{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string | null;
    skillLevel: string;
    city?: string | null;
    distance?: number; // en km
    matchesPlayed?: number;
    winRate?: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Service utilisateur
 */
export const userService = {
  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getMe(): Promise<UserProfile> {
    const response = await axios.get<UserProfile>('/users/me');
    return response.data;
  },

  /**
   * Récupérer le profil d'un utilisateur par ID
   */
  async getUserById(userId: string): Promise<UserProfile> {
    const response = await axios.get<UserProfile>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Mettre à jour le profil de l'utilisateur connecté
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await axios.put<UserProfile>('/users/me', data);
    return response.data;
  },

  /**
   * Uploader l'avatar de l'utilisateur
   */
  async uploadAvatar(formData: FormData): Promise<{
    avatarUrl: string;
  }> {
    const response = await axios.post<{ avatarUrl: string }>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Supprimer l'avatar de l'utilisateur
   */
  async deleteAvatar(): Promise<void> {
    await axios.delete('/users/me/avatar');
  },

  /**
   * Récupérer les statistiques de l'utilisateur connecté
   */
  async getMyStatistics(): Promise<UserStatistics> {
    const response = await axios.get<UserStatistics>('/users/me/statistics');
    return response.data;
  },

  /**
   * Récupérer les statistiques d'un utilisateur par ID
   */
  async getUserStatistics(userId: string): Promise<UserStatistics> {
    const response = await axios.get<UserStatistics>(
      `/users/${userId}/statistics`
    );
    return response.data;
  },

  /**
   * Rechercher des joueurs
   */
  async searchPlayers(
    params: SearchPlayersParams
  ): Promise<SearchPlayersResult> {
    const response = await axios.get<SearchPlayersResult>('/users/search', {
      params,
    });
    return response.data;
  },

  /**
   * Ajouter un joueur aux favoris
   */
  async addFavorite(userId: string): Promise<void> {
    await axios.post(`/users/me/favorites/${userId}`);
  },

  /**
   * Retirer un joueur des favoris
   */
  async removeFavorite(userId: string): Promise<void> {
    await axios.delete(`/users/me/favorites/${userId}`);
  },

  /**
   * Récupérer la liste des favoris
   */
  async getFavorites(): Promise<UserProfile[]> {
    const response = await axios.get<UserProfile[]>('/users/me/favorites');
    return response.data;
  },

  /**
   * Bloquer un utilisateur
   */
  async blockUser(userId: string): Promise<void> {
    await axios.post(`/users/me/blocked/${userId}`);
  },

  /**
   * Débloquer un utilisateur
   */
  async unblockUser(userId: string): Promise<void> {
    await axios.delete(`/users/me/blocked/${userId}`);
  },

  /**
   * Récupérer la liste des utilisateurs bloqués
   */
  async getBlockedUsers(): Promise<UserProfile[]> {
    const response = await axios.get<UserProfile[]>('/users/me/blocked');
    return response.data;
  },
};
