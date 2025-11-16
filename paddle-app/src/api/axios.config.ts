/**
 * Configuration Axios
 * Instance axios configurée avec intercepteurs pour l'authentification et la gestion des erreurs
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import Config from 'react-native-config';
import { store } from '@/store';
import { logout, updateTokens } from '@/store/slices/authSlice';

/**
 * URL de base de l'API
 * En développement: Utilise l'URL depuis .env ou localhost
 * En production: Utilise l'URL de production
 */
const BASE_URL = __DEV__
  ? Config.API_URL || 'http://localhost:3000/api'
  : Config.API_URL_PROD || 'https://api.paddle-app.com/api';

/**
 * Configuration par défaut pour l'instance Axios
 */
const axiosConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Instance Axios principale
 */
const axiosInstance: AxiosInstance = axios.create(axiosConfig);

/**
 * Instance Axios pour le refresh de token
 * Évite les boucles infinies lors du refresh
 */
const refreshAxiosInstance: AxiosInstance = axios.create(axiosConfig);

/**
 * File d'attente des requêtes en attente de refresh
 */
interface PendingRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: PendingRequest[] = [];

/**
 * Processus de file d'attente après refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Intercepteur de requête
 * Ajoute le token d'authentification dans les headers
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const { accessToken } = state.auth;

    // Ajoute le token Bearer si disponible
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log de la requête en mode développement
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse
 * Gère les erreurs et le refresh du token
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de la réponse en mode développement
    if (__DEV__) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (__DEV__) {
      console.error('[API Response Error]', error.response?.status, error.message);
    }

    // Gestion de l'erreur 401 (Unauthorized) - Token expiré
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, ajouter la requête à la file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = store.getState();
      const { refreshToken } = state.auth;

      if (!refreshToken) {
        // Pas de refresh token, déconnexion
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        // Appel API pour refresh le token
        const response = await refreshAxiosInstance.post<{
          accessToken: string;
          refreshToken: string;
        }>('/auth/refresh', {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Mise à jour des tokens dans Redux
        store.dispatch(
          updateTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Mise à jour du header de la requête originale
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Traitement de la file d'attente
        processQueue(null, newAccessToken);

        // Retry de la requête originale
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Échec du refresh, déconnexion
        processQueue(refreshError as Error, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Gestion de l'erreur 403 (Forbidden)
    if (error.response?.status === 403) {
      // L'utilisateur n'a pas les permissions
      // Vous pouvez ajouter une notification ici
    }

    // Gestion de l'erreur 404 (Not Found)
    if (error.response?.status === 404) {
      // Ressource non trouvée
    }

    // Gestion de l'erreur 500 (Internal Server Error)
    if (error.response?.status === 500) {
      // Erreur serveur
    }

    // Gestion de l'erreur réseau (Network Error)
    if (error.message === 'Network Error') {
      // Pas de connexion internet
    }

    // Gestion du timeout
    if (error.code === 'ECONNABORTED') {
      // Timeout de la requête
    }

    return Promise.reject(error);
  }
);

/**
 * Helper pour extraire le message d'erreur
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    // Message d'erreur depuis le serveur
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    // Messages d'erreur par défaut selon le statut
    switch (axiosError.response?.status) {
      case 400:
        return 'Requête invalide';
      case 401:
        return 'Non authentifié';
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Ressource non trouvée';
      case 409:
        return 'Conflit avec une ressource existante';
      case 422:
        return 'Données de validation incorrectes';
      case 429:
        return 'Trop de requêtes, veuillez réessayer plus tard';
      case 500:
        return 'Erreur serveur, veuillez réessayer plus tard';
      case 503:
        return 'Service temporairement indisponible';
      default:
        return axiosError.message || 'Une erreur est survenue';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Une erreur inconnue est survenue';
};

/**
 * Helper pour vérifier si l'erreur est une erreur réseau
 */
export const isNetworkError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.message === 'Network Error';
};

/**
 * Helper pour vérifier si l'erreur est un timeout
 */
export const isTimeoutError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.code === 'ECONNABORTED';
};

/**
 * Helper pour vérifier si l'erreur est une erreur d'authentification
 */
export const isAuthError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 401;
};

/**
 * Export de l'instance Axios
 */
export default axiosInstance;
