/**
 * Redux slice pour les données utilisateur étendues
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserStatistics {
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  winRate: number;
  currentStreak: number;
  longestWinStreak: number;
  totalPlayTime: number;
  ranking?: number;
  eloScore: number;
}

interface UserState {
  statistics: UserStatistics | null;
  favorites: string[]; // IDs des joueurs favoris
  blockedUsers: string[]; // IDs des utilisateurs bloqués
  searchHistory: string[]; // Historique de recherche
  recentlyViewedProfiles: string[]; // Profils récemment consultés
}

const initialState: UserState = {
  statistics: null,
  favorites: [],
  blockedUsers: [],
  searchHistory: [],
  recentlyViewedProfiles: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set statistics
    setStatistics: (state, action: PayloadAction<UserStatistics>) => {
      state.statistics = action.payload;
    },

    // Update statistics partiellement
    updateStatistics: (state, action: PayloadAction<Partial<UserStatistics>>) => {
      if (state.statistics) {
        state.statistics = { ...state.statistics, ...action.payload };
      }
    },

    // Ajouter un favori
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },

    // Retirer un favori
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },

    // Bloquer un utilisateur
    blockUser: (state, action: PayloadAction<string>) => {
      if (!state.blockedUsers.includes(action.payload)) {
        state.blockedUsers.push(action.payload);
      }
    },

    // Débloquer un utilisateur
    unblockUser: (state, action: PayloadAction<string>) => {
      state.blockedUsers = state.blockedUsers.filter((id) => id !== action.payload);
    },

    // Ajouter à l'historique de recherche
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      // Retirer si déjà présent pour le remettre en premier
      state.searchHistory = state.searchHistory.filter((term) => term !== action.payload);
      // Ajouter en premier
      state.searchHistory.unshift(action.payload);
      // Garder seulement les 10 derniers
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
    },

    // Clear search history
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },

    // Ajouter un profil récemment consulté
    addRecentlyViewedProfile: (state, action: PayloadAction<string>) => {
      // Retirer si déjà présent
      state.recentlyViewedProfiles = state.recentlyViewedProfiles.filter(
        (id) => id !== action.payload
      );
      // Ajouter en premier
      state.recentlyViewedProfiles.unshift(action.payload);
      // Garder seulement les 20 derniers
      if (state.recentlyViewedProfiles.length > 20) {
        state.recentlyViewedProfiles = state.recentlyViewedProfiles.slice(0, 20);
      }
    },

    // Reset user state (pour déconnexion)
    resetUserState: () => initialState,
  },
});

export const {
  setStatistics,
  updateStatistics,
  addFavorite,
  removeFavorite,
  blockUser,
  unblockUser,
  addToSearchHistory,
  clearSearchHistory,
  addRecentlyViewedProfile,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
